"use client"

import type { AprimoRecord } from "@/models/aprimo"

function getThumbnailUri(record: AprimoRecord): string | undefined {
  return record._embedded?.masterfilelatestversion?._embedded?.thumbnail?.uri
}

interface RecordsTableProps {
  records: AprimoRecord[]
}

export function RecordsTable({ records }: RecordsTableProps) {
  return (
    <table className="mt-4 w-full text-sm border-collapse">
      <thead>
        <tr className="border-b text-left">
          <th className="pb-2 pr-4 font-medium w-20"></th>
          <th className="pb-2 pr-4 font-medium">ID</th>
          <th className="pb-2 pr-4 font-medium">Content Type</th>
          <th className="pb-2 pr-4 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id} className="border-b last:border-0">
            <td className="py-2 pr-4">
              {getThumbnailUri(record)
                ? <img src={getThumbnailUri(record)} alt="" className="w-16 h-16 object-cover rounded" />
                : <div className="w-16 h-16 bg-muted rounded" />}
            </td>
            <td className="py-2 pr-4 font-mono text-xs">{record.id}</td>
            <td className="py-2 pr-4">{record.contentType ?? "-"}</td>
            <td className="py-2 pr-4">{record.status ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
