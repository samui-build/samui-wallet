import type { Cluster } from '@workspace/db/entity/cluster'
import type { GetTokenAccountsResult } from '@workspace/solana-client/get-token-accounts'

import { ellipsify } from '@workspace/core/ellipsify'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'

import { PortfolioUiExplorerLink } from './portfolio-ui-explorer-link.js'

export function AccountUiTokens({ cluster, items }: { cluster: Cluster; items: GetTokenAccountsResult }) {
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
                    cluster={cluster}
                    label={ellipsify(pubkey.toString())}
                    path={`/address/${pubkey.toString()}`}
                  />
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <span className="font-mono">
                  <PortfolioUiExplorerLink
                    cluster={cluster}
                    label={ellipsify(account.data.parsed.info.mint)}
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
