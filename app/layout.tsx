import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Botanipal',
  description: 'Plants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico?v=2" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png?v=2" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
