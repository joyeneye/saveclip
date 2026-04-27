'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Shield, Monitor, Film, Repeat, Globe } from 'lucide-react'

const features = [
  {
    Icon: Zap,
    title: 'Lightning Fast',
    desc: 'Downloads begin in under a second. Zero queues, zero waiting rooms.',
    from: 'from-yellow-500/15',
    to: 'to-orange-500/15',
    border: 'border-yellow-500/20 hover:border-yellow-500/40',
    icon: 'text-yellow-400',
  },
  {
    Icon: Shield,
    title: 'Zero Malware',
    desc: 'No ads, no tracking, no pop-ups. Ever. Just a clean, trustworthy tool.',
    from: 'from-emerald-500/15',
    to: 'to-green-500/15',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    icon: 'text-emerald-400',
  },
  {
    Icon: Monitor,
    title: 'Any Device',
    desc: 'Works perfectly on desktop, tablet, and mobile. No app to install.',
    from: 'from-blue-500/15',
    to: 'to-cyan-500/15',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    icon: 'text-blue-400',
  },
  {
    Icon: Film,
    title: 'True HD Quality',
    desc: 'Download up to 1080p Full HD. Crystal clear, zero re-compression.',
    from: 'from-violet-500/15',
    to: 'to-purple-500/15',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    icon: 'text-violet-400',
  },
  {
    Icon: Repeat,
    title: 'Video or Audio',
    desc: 'Grab the full video as MP4 or extract just the audio as MP3.',
    from: 'from-pink-500/15',
    to: 'to-rose-500/15',
    border: 'border-pink-500/20 hover:border-pink-500/40',
    icon: 'text-pink-400',
  },
  {
    Icon: Globe,
    title: '5 Major Platforms',
    desc: 'YouTube, Instagram, TikTok, Twitter/X, and Vimeo — all in one place.',
    from: 'from-cyan-500/15',
    to: 'to-teal-500/15',
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    icon: 'text-cyan-400',
  },
]

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="features"
      ref={ref}
      className="px-6 py-28 bg-gradient-to-b from-transparent via-violet-950/[0.07] to-transparent"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Why SaveClip</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Built different</h2>
          <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">
            Not your average video downloader. SaveClip is fast, clean, and built to last.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ Icon, title, desc, from, to, border, icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className={`group p-6 rounded-2xl bg-gradient-to-br ${from} ${to} border ${border} hover:scale-[1.02] transition-all duration-300 cursor-default`}
            >
              <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center mb-4">
                <Icon className={`w-5 h-5 ${icon}`} />
              </div>
              <h3 className="font-bold text-white mb-1.5">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
