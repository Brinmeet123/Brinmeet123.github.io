import type { Metadata } from 'next'
import './styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HighlightProvider from '@/components/HighlightProvider'

export const metadata: Metadata = {
  title: 'Virtual Diagnostic Simulator',
  description: 'Step into the role of a doctor. Interview AI patients, choose tests, and practice clinical reasoning — safely and fictionally.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <HighlightProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </HighlightProvider>
      </body>
    </html>
  )
}

