import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { createReadStream, statSync, readdirSync } from 'fs'
import { unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'

const execFileAsync = promisify(execFile)

async function cleanupFiles(...paths: string[]) {
  await Promise.allSettled(paths.map((p) => unlink(p)))
}

function findTempFile(prefix: string): string | null {
  const files = readdirSync(tmpdir()).filter((f) => f.startsWith(prefix))
  return files.length ? join(tmpdir(), files[0]) : null
}

async function probeVideoCodec(filePath: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync(
      'ffprobe',
      ['-v', 'quiet', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', filePath],
      { timeout: 10000 }
    )
    return stdout.trim().toLowerCase()
  } catch {
    return 'unknown'
  }
}

async function remuxToMp4(input: string, output: string): Promise<void> {
  const vcodec = await probeVideoCodec(input)
  const isH264 = vcodec === 'h264' || vcodec === 'avc' || vcodec === 'avc1'

  if (isH264) {
    // Already H.264 — stream copy, just fix the container and move moov to front
    await execFileAsync(
      'ffmpeg',
      ['-i', input, '-c:v', 'copy', '-c:a', 'aac', '-movflags', '+faststart', '-y', output],
      { timeout: 120000 }
    )
    return
  }

  // Non-H.264 (VP9, AV1, HEVC, etc.) — transcode to H.264 for universal compatibility.
  // Try VideoToolbox hardware encoder first (fast on Apple Silicon), fall back to libx264.
  try {
    await execFileAsync(
      'ffmpeg',
      [
        '-i', input,
        '-c:v', 'h264_videotoolbox',
        '-q:v', '60',           // VideoToolbox quality (0–100, higher = better)
        '-c:a', 'aac', '-b:a', '192k',
        '-movflags', '+faststart',
        '-y', output,
      ],
      { timeout: 600000 }
    )
  } catch {
    await execFileAsync(
      'ffmpeg',
      [
        '-i', input,
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast',
        '-c:a', 'aac', '-b:a', '192k',
        '-movflags', '+faststart',
        '-y', output,
      ],
      { timeout: 600000 }
    )
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  const format = req.nextUrl.searchParams.get('format') || 'bestvideo+bestaudio/best'

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  const isAudio = format === 'bestaudio/best'
  const tmpId = randomUUID()
  const rawPrefix = `sc_${tmpId}_raw`
  const rawTemplate = join(tmpdir(), `${rawPrefix}.%(ext)s`)
  const finalPath = join(tmpdir(), `sc_${tmpId}_final.${isAudio ? 'mp3' : 'mp4'}`)

  let filename = 'video'
  try {
    const { stdout } = await execFileAsync(
      'yt-dlp',
      ['--get-filename', '-o', '%(title)s', '--no-playlist', url],
      { timeout: 15000 }
    )
    filename = stdout.trim().replace(/[<>:"/\\|?*\n\r]/g, '').slice(0, 200).trim() || 'video'
  } catch {}

  try {
    // ─── Step 1: Download ────────────────────────────────────────────────────
    if (isAudio) {
      await execFileAsync(
        'yt-dlp',
        [
          '-f', 'bestaudio/best',
          '-x', '--audio-format', 'mp3', '--audio-quality', '0',
          '-o', rawTemplate,
          '--no-playlist', url,
        ],
        { timeout: 300000 }
      )
    } else {
      await execFileAsync(
        'yt-dlp',
        [
          '-f', format,
          '--merge-output-format', 'mkv',  // MKV avoids moov-atom issues during merge
          '-o', rawTemplate,
          '--no-playlist', url,
        ],
        { timeout: 300000 }
      )
    }

    const rawFile = findTempFile(rawPrefix)
    if (!rawFile) throw new Error('yt-dlp produced no output file')

    // ─── Audio: already a valid MP3, stream directly ─────────────────────────
    if (isAudio) {
      const size = statSync(rawFile).size
      return new Response(streamFile(rawFile, [rawFile]), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': String(size),
          'Content-Disposition': `attachment; filename="${filename}.mp3"`,
        },
      })
    }

    // ─── Step 2: Remux / transcode → universally playable H.264 MP4 ─────────
    // Copies if already H.264. Transcodes VP9/AV1/etc. via VideoToolbox or libx264.
    await remuxToMp4(rawFile, finalPath)
    await cleanupFiles(rawFile)

    const size = statSync(finalPath).size
    return new Response(streamFile(finalPath, [finalPath]), {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(size),
        'Content-Disposition': `attachment; filename="${filename}.mp4"`,
      },
    })
  } catch (err: any) {
    console.error('Download error:', err.message)
    const leftovers = readdirSync(tmpdir()).filter((f) => f.startsWith(`sc_${tmpId}`))
    await cleanupFiles(...leftovers.map((f) => join(tmpdir(), f)))
    return NextResponse.json({ error: 'Download failed. Please try again.' }, { status: 500 })
  }
}

function streamFile(filePath: string, filesToCleanup: string[]): ReadableStream {
  const nodeStream = createReadStream(filePath)
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => controller.enqueue(chunk))
      nodeStream.on('end', () => {
        controller.close()
        cleanupFiles(...filesToCleanup)
      })
      nodeStream.on('error', (err) => {
        controller.error(err)
        cleanupFiles(...filesToCleanup)
      })
    },
    cancel() {
      nodeStream.destroy()
      cleanupFiles(...filesToCleanup)
    },
  })
}
