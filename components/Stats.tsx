'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '10M+', label: 'Videos Downloaded' },
  { value: '5', label: 'Platforms Supported' },
  { value: '190+', label: 'Countries Worldwide' },
  { value: '100%', label: 'Free Forever' },
]

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="px-6 py-16 border-y border-white/[0.06]">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400 mb-1.5">
              {s.value}
            </div>
            <div className="text-gray-600 text-sm">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
