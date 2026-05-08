"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { House } from "lucide-react"
import { useAprimo } from "@/context/aprimo-context"

export default function Home() {
  const { isConnected, connection } = useAprimo()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Aprimo Starter Kit</h1>
          <p className="text-lg text-muted-foreground">
            {isConnected
              ? "You're connected. Choose a tool below to get started."
              : "Connect to your Aprimo environment to get started. This application requires PKCE auth."}
          </p>
          {isConnected && (
            <a href={`https://${connection?.environment}.dam.aprimo.com/dam`}>
              <div className="border border-border rounded-lg p-6 text-left hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <House className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Aprimo Home</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Go to the Spaces page for your Aprimo environment.
                </p>
              </div>
            </a>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
