import type { Network } from '@workspace/db/entity/network'
import type { GetActivityItems } from '@workspace/solana-client/get-activity'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiRelativeDate } from '@workspace/ui/components/ui-relative-date'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { groupActivityItems } from './group-activity-items.tsx'
import { PortfolioUiTxExplorerIcon } from './portfolio-ui-tx-explorer-icon.tsx'
import { PortfolioUiTxLink } from './portfolio-ui-tx-link.tsx'
import { PortfolioUiTxStatus } from './portfolio-ui-tx-status.tsx'
import { PortfolioUiTxTimestamp } from './portfolio-ui-tx-timestamp.tsx'

export function PortfolioUiGetActivity({ network, items }: { network: Network; items: GetActivityItems }) {
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
                <UiIcon className="size-4" icon="calendar" />
                <UiTooltip content={`${date.toLocaleDateString()}`}>
                  <UiRelativeDate date={date} />
                </UiTooltip>
              </div>

              <div className="space-y-2">
                {transactions?.map((tx) => (
                  <div className="flex items-center justify-between" key={tx.signature}>
                    <div className="flex items-center gap-2">
                      <PortfolioUiTxStatus tx={tx} />
                      <PortfolioUiTxLink tx={tx} />
                      <PortfolioUiTxExplorerIcon network={network} signature={tx.signature} />
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
