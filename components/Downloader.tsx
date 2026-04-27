'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Link2, Loader2, Music, Video, AlertCircle, ChevronDown } from 'lucide-react'

interface Format {
  format_id: string
  ext: string
  height?: number
  filesize?: number
  label: string
  type: 'video' | 'audio'
}

interface VideoInfo {
  title: string
  thumbnail: string
  duration: number
  uploader: string
  platform: string
  formats: Format[]
}

function formatDuration(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

function formatSize(bytes?: number) {
  if (!bytes) return ''
  const mb = bytes / 1024 / 1024
  return mb > 1000 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`
}

const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#FF0000',
  instagram: '#E1306C',
  tiktok: '#69C9D0',
  twitter: '#1DA1F2',
  vimeo: '#1AB7EA',
  video: '#8B5CF6',
}

export default function Downloader() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  const handleFetch = async () => {
    const trimmed = url.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    setInfo(null)
    setStarted(false)

    try {
      const res = await fetch(`/api/info?url=${encodeURIComponent(trimmed)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch video info')
      setInfo(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (formatId: string) => {
    if (!url) return
    setDownloading(formatId)
    setStarted(false)
    setError(null)

    try {
      const res = await fetch(
        `/api/download?url=${encodeURIComponent(url.trim())}&format=${encodeURIComponent(formatId)}`
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Download failed — please try again.')
      }

      // Read filename from Content-Disposition header
      const disposition = res.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename="([^"]+)"/)
      const filename = match?.[1] || 'video.mp4'

      // Stream into a Blob then trigger the browser's native save dialog
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)

      setStarted(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex gap-3"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Link2 className="w-4 h-4 text-gray-600" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            placeholder="Paste a YouTube, Instagram, TikTok, Twitter or Vimeo URL…"
            className="w-full pl-11 pr-4 py-4 bg-white/[0.05] border border-white/[0.09] rounded-2xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.3),0_0_40px_rgba(139,92,246,0.08)]"
          />
        </div>
        <motion.button
          onClick={handleFetch}
          disabled={loading || !url.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-7 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-2xl font-semibold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Fetching…</>
          ) : (
            <><Download className="w-4 h-4" /> Analyze</>
          )}
        </motion.button>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm leading-relaxed">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download started notice */}
      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
              <Download className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Download started — check your downloads folder.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Info Card */}
      <AnimatePresence>
        {info && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            className="mt-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden backdrop-blur-2xl"
          >
            {/* Thumbnail + meta */}
            <div className="flex gap-4 p-5">
              {info.thumbnail && (
                <div className="relative flex-shrink-0 w-36 h-[80px] rounded-xl overflow-hidden bg-white/5">
                  <img
                    src={`/api/thumbnail?url=${encodeURIComponent(info.thumbnail)}`}
                    alt={info.title}
                    className="w-full h-full object-cover"
                  />
                  {info.duration > 0 && (
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {formatDuration(info.duration)}
                    </span>
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PLATFORM_COLORS[info.platform] || '#8B5CF6' }}
                  />
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium capitalize">
                    {info.platform}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 mb-1">
                  {info.title}
                </h3>
                {info.uploader && (
                  <p className="text-gray-600 text-xs truncate">{info.uploader}</p>
                )}
              </div>
            </div>

            {/* Format picker */}
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-gray-600 uppercase tracking-wider">Choose format</p>
                {downloading && (
                  <span className="text-[11px] text-violet-400 animate-pulse">
                    Preparing your file… this may take a moment
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {info.formats.map((fmt) => (
                  <motion.button
                    key={fmt.format_id}
                    onClick={() => handleDownload(fmt.format_id)}
                    disabled={downloading !== null}
                    whileHover={{ scale: downloading ? 1 : 1.03 }}
                    whileTap={{ scale: downloading ? 1 : 0.96 }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      fmt.type === 'audio'
                        ? 'border-emerald-500/25 bg-emerald-500/[0.06] hover:bg-emerald-500/[0.12] hover:border-emerald-500/50 text-emerald-300'
                        : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-violet-500/40 text-white'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {downloading === fmt.format_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : fmt.type === 'audio' ? (
                      <Music className="w-4 h-4" />
                    ) : (
                      <Video className="w-4 h-4 text-violet-400" />
                    )}
                    <span>{fmt.label}</span>
                    {fmt.filesize && (
                      <span className="text-[10px] text-gray-600">{formatSize(fmt.filesize)}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
