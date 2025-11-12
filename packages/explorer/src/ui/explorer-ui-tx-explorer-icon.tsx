import type { Network } from '@workspace/db/entity/network'

import { ExplorerUiExplorerIcon } from './explorer-ui-explorer-icon.tsx'

export function ExplorerUiTxExplorerIcon({ network, signature }: { network: Network; signature: string }) {
  return <ExplorerUiExplorerIcon network={network} path={`/tx/${signature}`} />
}
