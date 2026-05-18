"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAprimo } from "@/context/aprimo-context"
import { Expander } from "aprimo-js"

function MyItemContent() {
  const searchParams = useSearchParams()
  const recordId = searchParams.get("record")
  const { client, isConnected } = useAprimo()
  const [record, setRecord] = useState<object | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!recordId || !client || !isConnected) return

    async function fetchAsset() {
      const expander = Expander.create()
      ;(expander.for("record") as { expand: (...f: string[]) => Expander }).expand(
        "fields",
        "masterfilelatestversion",
        "classifications"
      )
      ;(expander.for("fileversion") as { expand: (...f: string[]) => Expander }).expand("thumbnail", "preview")

      const result = await client!.search.records(
        { searchExpression: { expression: `id='${recordId}'` } },
        expander
      )

      if (!result.ok) {
        setError(result.error?.message ?? "Failed to fetch record")
        return
      }

      const item = ((result.data as any)?.items ?? [])[0]
      if (!item) {
        setError("Record not found")
        return
      }

      setRecord(item)
    }

    fetchAsset()
  }, [recordId, client, isConnected])

  return (
    <main className="p-8">
      {!recordId && <p className="text-sm text-muted-foreground">No record ID provided.</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {record && (
        <>
          <p className="text-sm text-muted-foreground mb-3">Asset ID: <span className="font-mono">{recordId}</span></p>
        <pre className="text-xs bg-muted rounded-lg p-4 overflow-auto max-h-[80vh] whitespace-pre-wrap break-all">
          {JSON.stringify(record, null, 2)}
        </pre>
        </>
      )}
    </main>
  )
}

export default function MyItemPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Suspense>
        <MyItemContent />
      </Suspense>
      <Footer />
    </div>
  )
}
