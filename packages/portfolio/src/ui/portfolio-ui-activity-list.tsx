import type { Network } from '@workspace/db/network/network'
import { ExplorerUiExplorerIcon } from '@workspace/explorer/ui/explorer-ui-explorer-icon'
import { ExplorerUiTxTimestamp } from '@workspace/explorer/ui/explorer-ui-tx-timestamp'
import { useTranslation } from '@workspace/i18n'
import type { GetActivityItems } from '@workspace/solana-client/get-activity'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiRelativeDate } from '@workspace/ui/components/ui-relative-date'
import { groupActivityItems } from './group-activity-items.tsx'
import { PortfolioUiTxLink } from './portfolio-ui-tx-link.tsx'
import { PortfolioUiTxStatus } from './portfolio-ui-tx-status.tsx'

export function PortfolioUiActivityList({
  from,
  network,
  items,
}: {
  from: string
  network: Network
  items: GetActivityItems
}) {
  const { t } = useTranslation('portfolio')
  const grouped = groupActivityItems(items)
  return (
    <div>
      {items.length === 0 ? (
        <div>{t(($) => $.noTransactions)}</div>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ date, transactions }) => (
            <div className="space-y-4" key={date.getTime()}>
              <div className="flex gap-2 font-mono text-muted-foreground text-xs">
                <UiIcon className="size-4" icon="calendar" />
                <UiRelativeDate date={date} />
              </div>

              <div className="space-y-2">
                {transactions?.map((tx) => (
                  <div className="flex items-center justify-between" key={tx.signature}>
                    <div className="flex items-center gap-2">
                      <PortfolioUiTxStatus tx={tx} />
                      <PortfolioUiTxLink from={from} tx={tx} />
                      <ExplorerUiExplorerIcon network={network} path={`/tx/${tx.signature}`} provider="solana" />
                    </div>
                    <div className="truncate whitespace-nowrap text-right font-mono text-muted-foreground text-xs">
                      <ExplorerUiTxTimestamp blockTime={tx.blockTime} />
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
