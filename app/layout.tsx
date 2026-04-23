import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ARIA — Voice AI Personal Shopper',
  description: 'Meet ARIA, your AI shopping advisor. Voice-powered. Deeply personalized. No more regrets.',
  keywords: ['AI shopping', 'personal shopper', 'voice AI', 'product recommendation'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
