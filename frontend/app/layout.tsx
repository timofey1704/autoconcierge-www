import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers/Providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'СБЛ-Лизинг',
  description:
    'Мы работаем круглосуточно, чтобы вы были спокойны за свой автомобиль в любой ситуации. Наша команда профессиональных мастеров на выезде быстро придет на помощь и решит проблему.',
  openGraph: {
    title: 'СБЛ-Лизинг',
    description: 'Ваш спасательный круг на дороге.',
    url: 'https://ids-help.by/',
    siteName: 'СБЛ-Лизинг',
    locale: 'ru_RU',
    type: 'website',
  },
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
    <html lang="ru">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
