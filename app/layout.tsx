import type { Metadata } from 'next'
import { Inter, Merriweather, Montserrat, Bebas_Neue, Unbounded } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const merriweather = Merriweather({ weight: ['400', '700'], style: ['normal', 'italic'], subsets: ['latin', 'cyrillic'], variable: '--font-merriweather' })
const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], variable: '--font-montserrat' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })
const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--font-unbounded' })

export const metadata: Metadata = {
  title: 'CarouselGenius - AI-Powered Carousel Generator',
  description: 'Create, translate, and export professional social media carousels in minutes with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${
      inter.variable
    } ${
      merriweather.variable
    } ${
      montserrat.variable
    } ${
      bebasNeue.variable
    } ${
      unbounded.variable
    }`}>
      <body className="font-inter antialiased bg-gray-950 text-white">{children}</body>
    </html>
  )
}
