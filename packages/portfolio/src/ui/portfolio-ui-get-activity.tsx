import type { Cluster } from '@workspace/db/entity/cluster'
import type { GetActivityItems } from '@workspace/solana-client/get-activity'

import { UiTime } from '@workspace/ui/components/ui-time'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucideCalendar } from 'lucide-react'

import { groupActivityItems } from './group-activity-items.tsx'
import { PortfolioUiTxExplorerIcon } from './portfolio-ui-tx-explorer-icon.tsx'
import { PortfolioUiTxLink } from './portfolio-ui-tx-link.tsx'
import { PortfolioUiTxStatus } from './portfolio-ui-tx-status.tsx'
import { PortfolioUiTxTimestamp } from './portfolio-ui-tx-timestamp.tsx'

export function PortfolioUiGetActivity({ cluster, items }: { cluster: Cluster; items: GetActivityItems }) {
  const grouped = groupActivityItems(items)
  return (
    <div>
      {items.length === 0 ? (
        <div>No transactions found.</div>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ date, transactions }) => (
            <div className="space-y-4" key={date.getTime()}>
              <div className="flex text-muted-foreground text-xs font-mono gap-2">
                <LucideCalendar className="size-4" />
                <UiTooltip content={`${date.toLocaleDateString()}`}>
                  <UiTime time={date.getTime()}></UiTime>
                </UiTooltip>
              </div>

              <div className="space-y-2">
                {transactions?.map((tx) => (
                  <div className="flex items-center justify-between" key={tx.signature}>
                    <div className="flex items-center gap-2">
                      <PortfolioUiTxStatus tx={tx} />
                      <PortfolioUiTxLink tx={tx} />
                      <PortfolioUiTxExplorerIcon cluster={cluster} signature={tx.signature} />
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      <PortfolioUiTxTimestamp blockTime={tx.blockTime} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
