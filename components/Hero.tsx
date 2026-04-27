'use client'

import { motion } from 'framer-motion'
import Downloader from './Downloader'

const platforms = [
  { name: 'YouTube', color: '#FF0000' },
  { name: 'Instagram', color: '#E1306C' },
  { name: 'TikTok', color: '#69C9D0' },
  { name: 'Twitter / X', color: '#1DA1F2' },
  { name: 'Vimeo', color: '#1AB7EA' },
]

export default function Hero() {
  return (
    <section id="downloader" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        <div
          className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full opacity-[0.18] blur-[140px] animate-pulse"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', animationDuration: '5s' }}
        />
        <div
          className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full opacity-[0.14] blur-[140px] animate-pulse"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent 70%)', animationDuration: '7s', animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.08] blur-[100px] animate-pulse"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', animationDuration: '9s', animationDelay: '2s' }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-8 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Free · No signup · HD Quality · No watermarks
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[52px] md:text-[76px] font-black leading-[1.05] tracking-[-0.03em] mb-5"
        >
          Save Any Video,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
            Anywhere.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[17px] md:text-xl text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Download HD videos from any platform in seconds.
          No limits, no watermarks, no BS.
        </motion.p>

        {/* Downloader */}
        <Downloader />

        {/* Platform pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-2.5"
        >
          <span className="text-gray-700 text-xs mr-1">Supports</span>
          {platforms.map((p) => (
            <span
              key={p.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs text-gray-400 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
