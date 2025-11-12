import type { Network } from '@workspace/db/entity/network'
import type { ExplorerPath, ExplorerProvider } from '@workspace/solana-client/get-explorer-url'

import { ExplorerUiExplorerLink } from './explorer-ui-explorer-link.tsx'

export function ExplorerUiExplorers({ network, path }: { network: Network; path: ExplorerPath }) {
  const providers: ExplorerProvider[] = ['orb', 'solscan', 'solana']
  return (
    <div className="space-x-2 text-xs">
      {providers.map((provider) => (
        <ExplorerUiExplorerLink key={provider} network={network} path={path} provider={provider} />
      ))}
    </div>
  )
}
