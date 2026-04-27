import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-7176880833963568'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Downloaders — Free Video Downloader for YouTube, Instagram, TikTok & More',
  description:
    'Download HD videos from YouTube, Instagram, TikTok, Twitter, and Vimeo for free. No signup, no watermarks, no limits. The fastest online video downloader.',
  keywords:
    'video downloader, digital downloaders, youtube downloader, instagram video downloader, tiktok downloader, twitter video downloader, vimeo downloader, save video online free, download video HD',
  metadataBase: new URL('https://digitaldownloaders.com'),
  openGraph: {
    title: 'Digital Downloaders — Download Any Video, Instantly',
    description:
      'Free HD video downloader for YouTube, Instagram, TikTok, Twitter, and Vimeo. No signup required.',
    type: 'website',
    url: 'https://digitaldownloaders.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Downloaders — Free Video Downloader',
    description: 'Download videos from any platform in HD. Free, fast, no signup.',
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
      <head>
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
