'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link2, ScanSearch, Download } from 'lucide-react'

const steps = [
  {
    Icon: Link2,
    step: '01',
    title: 'Paste your URL',
    desc: 'Copy any video link from YouTube, Instagram, TikTok, Twitter/X, or Vimeo and paste it into the input above.',
  },
  {
    Icon: ScanSearch,
    step: '02',
    title: 'Analyze the video',
    desc: "Hit Analyze and we'll instantly detect all available formats — from 1080p HD to mobile-friendly sizes and MP3.",
  },
  {
    Icon: Download,
    step: '03',
    title: 'Download instantly',
    desc: 'Select your preferred quality and the file downloads directly to your device. No redirects, no ads.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" ref={ref} className="px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Simple Process</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">How it works</h2>
          <p className="text-gray-600 mt-4 text-lg">Three steps. That's it.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-[52px] left-[calc(33.33%+24px)] right-[calc(33.33%+24px)] h-px bg-gradient-to-r from-violet-500/40 via-blue-500/40 to-cyan-500/40" />

          {steps.map(({ Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/25 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/15 border border-violet-500/20 flex items-center justify-center group-hover:border-violet-500/40 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-5xl font-black text-white/[0.05] select-none tabular-nums">{step}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
