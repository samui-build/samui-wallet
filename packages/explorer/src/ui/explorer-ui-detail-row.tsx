import type { ReactNode } from 'react'

export function ExplorerUiDetailRow({ label, value }: { label: string; value: null | ReactNode | undefined }) {
  return (
    <div className="text-sm">
      <div className="mb-1 text-xs uppercase tracking-wider opacity-60">{label}</div>
      <div className="break-all font-medium">{value ?? 'N/A'}</div>
    </div>
  )
}
