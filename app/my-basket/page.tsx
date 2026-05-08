"use client"

import { useCallback, useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAprimo } from "@/context/aprimo-context"
import { supabase } from "@/lib/supabase"
import { Expander } from "aprimo-js"
import { RecordsTable } from "@/components/records-table"
import type { AprimoRecord } from "@/models/aprimo"

function BasketExampleContent() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get("requestId")
  const { client, isConnected } = useAprimo()

  const [records, setRecords] = useState<AprimoRecord[]>([])
  const [requestedCount, setRequestedCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = useCallback(async (ids: string[]) => {
    if (!client) return []

    const expander = Expander.create()
    ;(expander.for("record") as { expand: (...f: string[]) => Expander }).expand("masterfilelatestversion")
    ;(expander.for("fileversion") as { expand: (...f: string[]) => Expander }).expand("thumbnail")

    const BATCH_SIZE = 50
    const batches: string[][] = []
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      batches.push(ids.slice(i, i + BATCH_SIZE))
    }

    const batchResults = await Promise.all(
      batches.map((batch) => {
        const expression = batch.map((id) => `id='${id}'`).join(" OR ")
        return client.search.records({ searchExpression: { expression } }, expander)
      })
    )

    const failed = batchResults.filter((r) => !r.ok)
    if (failed.length) throw new Error(failed.map((r) => r.error?.message ?? "Search failed").join(", "))

    return batchResults.flatMap((r) => r.data?.items ?? []) as unknown as AprimoRecord[]
  }, [client])

  useEffect(() => {
    if (!requestId || !isConnected || !client) return

    async function load() {
      setLoading(true)
      setError(null)

      const { data: row, error: dbError } = await supabase
        .from("requested_records")
        .select("recordList")
        .eq("requestId", requestId)
        .single()

      if (dbError) {
        if (dbError.code === "PGRST116") {
          setNotFound(true)
        } else {
          setError(dbError.message)
        }
        setLoading(false)
        return
      }

      setRequestedCount(row.recordList.length)
      await supabase.from("requested_records").delete().eq("requestId", requestId)

      try {
        const fetched = await fetchRecords(row.recordList)
        setRecords(fetched)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed")
      }

      setLoading(false)
    }

    load()
  }, [requestId, isConnected, client, fetchRecords])

  if (!requestId) {
    return (
      <main className="p-8">
        <p className="text-sm text-muted-foreground">No requestId provided.</p>
      </main>
    )
  }

  return (
    <main className="p-8">
      {loading && <p className="text-sm text-muted-foreground">Loading records...</p>}

      {notFound && <p className="text-sm text-muted-foreground">Basket not found. The link may have expired or already been used.</p>}

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {records.length > 0 && (
        <>
          <p className="text-sm font-medium mb-3">
            {records.length} record{records.length !== 1 ? "s" : ""}
            {requestedCount !== null && ` (${requestedCount} requested)`}
          </p>
          <RecordsTable records={records} />
        </>
      )}
    </main>
  )
}

export default function BasketExamplePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Suspense>
        <BasketExampleContent />
      </Suspense>
      <Footer />
    </div>
  )
}
