import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { CartProvider } from '@/lib/cart-store'
import { MotionProvider } from '@/components/motion'
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

// Used for part numbers, SKUs and engine codes, where tabular figures and an
// unmistakable 0/O distinction actually matter.
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const DEFAULT_TITLE = 'Audi Parts Sales – Genuine & Aftermarket Audi Spare Parts'
const DEFAULT_DESCRIPTION =
  'Find the exact Audi spare part for your car. Guaranteed fitment by year, model, and engine code. Genuine OEM and vetted aftermarket options for the A3, A4, A5, A6, Q5, Q7, TT, and more.'

export const metadata: Metadata = {
  // Without metadataBase every relative canonical and og:url resolves against
  // localhost in production. Nothing below works without it.
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  keywords:
    'Audi spare parts, OEM Audi parts, Audi A4 parts, Audi A3 parts, Audi Q5 parts, TFSI parts, TDI parts, genuine Audi',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/'),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-audi-anthracite">
        <MotionProvider>
          <CartProvider>{children}</CartProvider>
        </MotionProvider>
        <Script src="//code.jivosite.com/widget/WUYLhQ67Jq" strategy="afterInteractive" />
      </body>
    </html>
  )
}
