import type { ReactNode } from 'react'
import { ExplorerUiDetailRow } from './explorer-ui-detail-row.tsx'

export function ExplorerUiDetailRowWide({ label, value }: { label: string; value: null | ReactNode | undefined }) {
  return <ExplorerUiDetailRow className="flex items-center justify-between" label={label} value={value} />
}
