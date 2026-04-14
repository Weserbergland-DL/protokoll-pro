import type { Metadata } from 'next'
import '@fontsource-variable/geist'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'ImmoAkte - Digitale Immobiliendokumentation',
  description: 'Mietverhältnisse verwalten, Übergabeprotokolle erstellen und rechtliche Dokumente ausfüllen — alles in einer App.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
