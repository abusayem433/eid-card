import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AFS Eid Card',
  description: 'Create your personalized Eid card with ACS Future School',
  generator: 'Next.js',
  icons: {
    icon: '/images/AFS Logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
