import type { GetActivityItem } from '@workspace/solana-client/get-activity'
import { UiIcon } from '@workspace/ui/components/ui-icon'

export function PortfolioUiTxStatus({ tx }: { tx: GetActivityItem }) {
  return tx.err ? (
    <UiIcon className="size-4 text-red-500" icon="circleX" />
  ) : (
    <UiIcon className="size-4 text-green-500" icon="checkCircle" />
  )
}
