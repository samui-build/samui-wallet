import type { Cluster } from '@workspace/db/entity/cluster'
import type { GetActivityResult } from '@workspace/solana-client/get-activity'

import { unixTimestampToDate } from '@workspace/solana-client/unix-timestamp-to-date'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { Link } from 'react-router'

import { PortfolioUiExplorerLink } from './portfolio-ui-explorer-link.js'

export function PortfolioUiGetActivity({ cluster, items }: { cluster: Cluster; items: GetActivityResult }) {
  return (
    <div>
      {items.length === 0 ? (
        <div>No transactions found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Signature</TableHead>
              <TableHead className="text-right">Slot</TableHead>
              <TableHead>Block Time</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.signature}>
                <TableCell className="font-mono">
                  <Link to={`/portfolio/tx/${item.signature}`}>{ellipsify(item.signature, 8)}</Link>
                </TableCell>
                <TableCell className="font-mono text-right">
                  <PortfolioUiExplorerLink
                    cluster={cluster}
                    label={item.slot.toString()}
                    path={`/block/${item.slot}`}
                  />
                </TableCell>
                <TableCell>{unixTimestampToDate(item.blockTime)?.toISOString()}</TableCell>
                <TableCell className="text-right">
                  {item.err ? (
                    <span className="text-red-500">Failed</span>
                  ) : (
                    <span className="text-green-500">Success</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
