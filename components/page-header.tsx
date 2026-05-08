"use client"

import { usePathname } from "next/navigation"

const routeLabels: Record<string, string> = {
  "my-item": "My Item",
  "my-basket": "My Basket",
}

export function PageHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const pageTitle = routeLabels[segments[segments.length - 1]] ?? segments[segments.length - 1]

  return (
    <div className="border-b border-border bg-background">
      <div className="px-6 py-3">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>
    </div>
  )
}
