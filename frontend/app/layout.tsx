import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers/Providers'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'СБЛ-Лизинг',
  description:
    'Мы работаем круглосуточно, чтобы вы были спокойны за свой автомобиль в любой ситуации. Наша команда профессиональных мастеров на выезде быстро придет на помощь и решит проблему.',
  alternates: {
    canonical: 'https://ids-help.by/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <Toaster />
          <main className="grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
