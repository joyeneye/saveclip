import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <span className="font-bold text-white text-[15px]">
            Digital<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Downloaders</span>
          </span>
        </div>

        <p className="text-gray-700 text-xs text-center">
          © {new Date().getFullYear()} Digital Downloaders · The fastest free video downloader
        </p>

        <div className="flex items-center gap-6 text-xs text-gray-700">
          <Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-400 transition-colors">Terms of Use</Link>
          <Link href="#" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
