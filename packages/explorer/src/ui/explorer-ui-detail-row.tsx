import type { ReactNode } from 'react'

export function ExplorerUiDetailRow({ label, value }: { label: string; value: null | ReactNode | undefined }) {
  return (
    <div className="text-sm">
      <div className="text-xs mb-1 opacity-60 tracking-wider uppercase">{label}</div>
      <div className="font-medium break-all">{value ?? 'N/A'}</div>
    </div>
  )
}
