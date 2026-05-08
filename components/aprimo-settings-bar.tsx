"use client"

import { useAprimo } from "@/context/aprimo-context"

export function AprimoSettingsBar() {
  const { connection, isConnected } = useAprimo()

  return (
    <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
      {connection?.environment && (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium border ${isConnected ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800" : "bg-muted text-muted-foreground border-border"}`}>
          {connection.environment}
        </span>
      )}
    </div>
  )
}
