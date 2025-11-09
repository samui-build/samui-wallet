import type { Network } from '@workspace/db/entity/network'
import type { GetTokenAccountsResult } from '@workspace/solana-client/get-token-accounts'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

import { PortfolioUiExplorerLink } from './portfolio-ui-explorer-link.tsx'

export function WalletUiTokens({ network, items }: { network: Network; items: GetTokenAccountsResult }) {
  return items.length === 0 ? (
    <div>No token accounts found.</div>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Public Key</TableHead>
          <TableHead>Mint</TableHead>
          <TableHead className="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map(({ account, pubkey }) => (
          <TableRow key={pubkey.toString()}>
            <TableCell>
              <div className="flex space-x-2">
                <span className="font-mono">
                  <PortfolioUiExplorerLink
                    label={ellipsify(pubkey.toString())}
                    network={network}
                    path={`/address/${pubkey.toString()}`}
                  />
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <span className="font-mono">
                  <PortfolioUiExplorerLink
                    label={ellipsify(account.data.parsed.info.mint)}
                    network={network}
                    path={`/address/${account.data.parsed.info.mint.toString()}`}
                  />
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <span className="font-mono">{account.data.parsed.info.tokenAmount.uiAmount}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
