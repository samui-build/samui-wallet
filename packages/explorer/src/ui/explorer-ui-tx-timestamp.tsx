import type { UnixTimestamp } from '@solana/kit'

import { unixTimestampToDate } from '@workspace/solana-client/unix-timestamp-to-date'
import { UiTime } from '@workspace/ui/components/ui-time'

export function ExplorerUiTxTimestamp({ blockTime }: { blockTime: null | UnixTimestamp }) {
  const time = unixTimestampToDate(blockTime)
  if (!time) {
    return 'No time'
  }
  return <UiTime time={time} />
}
