import type { GetActivityItem } from '@workspace/solana-client/get-activity'
import { UiIcon } from '@workspace/ui/components/ui-icon'

export function ExplorerUiTxStatus({ tx }: { tx: GetActivityItem }) {
  return tx.err ? (
    <UiIcon className="text-red-500 size-4" icon="circleX" />
  ) : (
    <UiIcon className="text-green-500 size-4" icon="checkCircle" />
  )
}
