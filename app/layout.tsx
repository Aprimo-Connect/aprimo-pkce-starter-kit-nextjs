import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AprimoProvider } from '@/context/aprimo-context'
import { AprimoAuthInit } from '@/components/aprimo-auth-init'
import { AprimoSettingsBar } from '@/components/aprimo-settings-bar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aprimo Starter Kit',
  description: 'Connect and manage your Aprimo DAM environment',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background">
        <AprimoProvider>
          <AprimoAuthInit />
          <AprimoSettingsBar />
          {children}
        </AprimoProvider>
        <Toaster position="top-right" richColors offset="88px" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
