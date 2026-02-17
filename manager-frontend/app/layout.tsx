import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers/Providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'СБЛ Лизинг - Панель управления',
  description: 'СБЛ Лизинг - Панель управления',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-display flex min-h-screen flex-col">
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
