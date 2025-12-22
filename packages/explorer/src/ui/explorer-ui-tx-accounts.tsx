import { lamports } from '@solana/kit'
import { useTranslation } from '@workspace/i18n'
import { Badge } from '@workspace/ui/components/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { formatBalance } from '../data-access/format-balance.tsx'
import type { ExplorerGetTransactionResult } from '../data-access/use-explorer-get-transaction.ts'
import { ExplorerUiBalanceSolDiff } from './explorer-ui-balance-sol-diff.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiProgramLabel } from './explorer-ui-program-label.tsx'

export function ExplorerUiTxAccounts({ basePath, tx }: { basePath: string; tx: ExplorerGetTransactionResult }) {
  const { t } = useTranslation('explorer')
  if (!tx) {
    return null
  }
  const accounts = tx.transaction.message.accountKeys
  if (!accounts) {
    return null
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{t(($) => $.account)}</TableHead>
          <TableHead>{t(($) => $.change)} (SOL)</TableHead>
          <TableHead>{t(($) => $.postBalance)} (SOL)</TableHead>
          <TableHead>{t(($) => $.details)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((item, idx) => (
          <TableRow key={item.pubkey}>
            <TableCell className="md:w-[350px]">
              <ExplorerUiLinkAddress
                address={item.pubkey}
                basePath={basePath}
                className="text-xs"
                label={<ExplorerUiProgramLabel address={item.pubkey} />}
              />
            </TableCell>
            <TableCell className="font-mono md:w-[100px]">
              <ExplorerUiBalanceSolDiff post={tx.meta?.postBalances[idx]} pre={tx.meta?.preBalances[idx]} />
            </TableCell>
            <TableCell className="font-mono text-xs">
              {formatBalance({ balance: tx.meta?.postBalances[idx] ?? lamports(0n), decimals: 9 })}
            </TableCell>
            <TableCell className="space-x-2">
              {item.signer ? <Badge variant="secondary">Signer</Badge> : null}
              {item.writable ? <Badge variant="destructive">Writable</Badge> : null}
              {idx === 0 ? <Badge variant="default">Fee payer</Badge> : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
