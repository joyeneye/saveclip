import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SaveClip.io — Free Video Downloader for YouTube, Instagram, TikTok & More',
  description:
    'Download HD videos from YouTube, Instagram, TikTok, Twitter, and Vimeo for free. No signup, no watermarks, no limits. The fastest online video downloader.',
  keywords:
    'video downloader, youtube downloader, instagram video downloader, tiktok downloader, twitter video downloader, vimeo downloader, save video online free, download video HD',
  metadataBase: new URL('https://saveclip.io'),
  openGraph: {
    title: 'SaveClip.io — Download Any Video, Instantly',
    description:
      'Free HD video downloader for YouTube, Instagram, TikTok, Twitter, and Vimeo. No signup required.',
    type: 'website',
    url: 'https://saveclip.io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaveClip.io — Free Video Downloader',
    description: 'Save videos from any platform in HD. Free, fast, no signup.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
