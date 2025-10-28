import type { ReactNode } from 'react'

export function PortfolioUiTxDetailRow({ label, value }: { label: string; value: null | ReactNode | undefined }) {
  return (
    <div className="text-[10px]">
      <div className="text-[9px] mb-1 opacity-60 tracking-wider uppercase">{label}</div>
      <div className="font-medium break-all">{value ?? 'N/A'}</div>
    </div>
  )
}
