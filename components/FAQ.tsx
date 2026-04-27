'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Is SaveClip completely free?',
    a: "Yes — 100% free, forever. No subscription, no sign-up, no credit card. Just paste a URL and download.",
  },
  {
    q: 'Which platforms are supported?',
    a: 'SaveClip supports YouTube, Instagram (Reels, posts, stories), TikTok, Twitter/X, and Vimeo.',
  },
  {
    q: 'What video qualities can I download?',
    a: 'Up to 1080p Full HD. You can also choose 720p, 480p, or 360p for smaller files, and MP3 for audio only.',
  },
  {
    q: 'Do I need to install any software?',
    a: 'No — SaveClip runs entirely in your browser. Visit the website, paste a URL, done.',
  },
  {
    q: 'Are there any download limits?',
    a: 'None. Download as many videos as you want, as often as you want, with no restrictions.',
  },
  {
    q: 'Is it safe and private?',
    a: "Absolutely. We never log your URLs, never track your activity, and never serve ads or malware. Your privacy is fully respected.",
  },
  {
    q: 'Why can\'t I download a video?',
    a: 'Some videos are private or region-restricted. Make sure the URL is for a publicly accessible video. If the problem persists, the platform may have updated their API.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-medium text-gray-300 group-hover:text-white transition-colors duration-200 text-sm md:text-base leading-snug">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-gray-600 transition-all duration-300 ${
            open ? 'rotate-180 text-violet-400' : 'group-hover:text-gray-400'
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="faq" ref={ref} className="px-6 py-28">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Common questions</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {faqs.map((f) => (
            <FAQItem key={f.q} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
