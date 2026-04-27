import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-2xl bg-[#05050f]/70 border-b border-white/[0.06]">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <span className="font-bold text-[17px] tracking-tight text-white">
          Save<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Clip</span>
          <span className="text-gray-600 font-normal">.io</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
        <Link href="#how-it-works" className="hover:text-white transition-colors duration-200">How it works</Link>
        <Link href="#features" className="hover:text-white transition-colors duration-200">Features</Link>
        <Link href="#faq" className="hover:text-white transition-colors duration-200">FAQ</Link>
      </div>

      <a
        href="#downloader"
        className="px-5 py-2 text-sm font-medium rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-white"
      >
        Get Started
      </a>
    </nav>
  )
}
