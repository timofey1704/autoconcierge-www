import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers/Providers'

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
    <html lang="en">
      <body className="font-display flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
