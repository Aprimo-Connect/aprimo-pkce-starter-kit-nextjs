"use client"

import { Wifi, WifiOff } from "lucide-react"
import Link from "next/link"
import { useAprimo } from "@/context/aprimo-context"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"

export function Navbar() {
  const { isConnected, connection } = useAprimo()

  return (
    <nav className="bg-background sticky top-0 z-50">
      <div className="border-b border-border px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="py-2">
            <img src="/images/aprimo-starter-kit-sm.png" alt="Aprimo Starter Kit" style={{ width: 100, height: "auto" }} />
          </Link>

          <div className="flex items-center gap-6 text-sm">
            {isConnected && connection?.environment ? (
              <a href={`https://${connection.environment}.dam.aprimo.com/dam`}>
                <Badge variant="outline" className="flex items-center gap-1.5 border-success text-success">
                  <Wifi className="h-3 w-3" />
                  {connection.environment}
                </Badge>
              </a>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1.5 border-muted-foreground text-muted-foreground">
                <WifiOff className="h-3 w-3" />
                Disconnected
              </Badge>
            )}
          </div>
        </div>
      </div>

      <PageHeader />
    </nav>
  )
}
