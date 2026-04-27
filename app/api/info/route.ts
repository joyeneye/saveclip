import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const QUALITY_PRESETS = [
  { label: '1080p', height: 1080 },
  { label: '720p', height: 720 },
  { label: '480p', height: 480 },
  { label: '360p', height: 360 },
]

function detectPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter'
  if (url.includes('vimeo.com')) return 'vimeo'
  return 'video'
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const { stdout } = await execFileAsync(
      'yt-dlp',
      ['--dump-json', '--no-playlist', url],
      { timeout: 30000 }
    )

    const info = JSON.parse(stdout)
    const platform = detectPlatform(url)
    const rawFormats: any[] = info.formats || []

    const formats: any[] = []

    for (const preset of QUALITY_PRESETS) {
      const videoFmts = rawFormats.filter(
        (f) => f.vcodec !== 'none' && f.height && f.height <= preset.height + 60
      )
      const best = videoFmts.sort((a, b) => (b.height || 0) - (a.height || 0))[0]
      if (best) {
        // No codec restrictions here — download whatever quality the platform provides.
        // The download route always transcodes non-H.264 to H.264 for universal playback.
        const h = preset.height
        formats.push({
          format_id: `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`,
          ext: 'mp4',
          height: best.height,
          filesize: best.filesize || best.filesize_approx,
          label: preset.label,
          type: 'video',
        })
      }
    }

    formats.push({
      format_id: 'bestaudio/best',
      ext: 'mp3',
      label: 'MP3',
      type: 'audio',
    })

    // Deduplicate by label
    const seen = new Set<string>()
    const uniqueFormats = formats.filter((f) => {
      if (seen.has(f.label)) return false
      seen.add(f.label)
      return true
    })

    return NextResponse.json({
      title: info.title || 'Untitled',
      thumbnail: info.thumbnail || '',
      duration: info.duration || 0,
      uploader: info.uploader || info.channel || '',
      platform,
      formats: uniqueFormats,
    })
  } catch (err: any) {
    console.error('yt-dlp info error:', err.message)
    return NextResponse.json(
      {
        error:
          'Could not fetch video info. Make sure the URL is valid and yt-dlp is installed (`brew install yt-dlp`).',
      },
      { status: 500 }
    )
  }
}
