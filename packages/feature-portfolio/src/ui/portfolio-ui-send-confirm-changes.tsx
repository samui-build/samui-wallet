import { useTranslation } from '@workspace/i18n'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import {
  formatSimulatedTransactionChange,
  getSimulatedTransactionChangeRows,
  type SimulatedTransactionChangeRow,
} from '@workspace/solana-client/get-simulated-transaction-change-rows'
import type { SimulatePreparedTransactionResult } from '@workspace/solana-client/simulate-prepared-transaction'
import { Badge } from '@workspace/ui/components/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import type { TokenBalance } from '../data-access/use-get-token-balances.ts'

export function PortfolioUiSendConfirmChanges({
  mint,
  simulation,
}: {
  mint: TokenBalance
  simulation: SimulatePreparedTransactionResult | undefined
}) {
  const { t } = useTranslation('portfolio')

  if (simulation?.status !== 'success') {
    return null
  }

  const rows = getSendConfirmChangeRows({ mint, simulation })

  if (!rows.length) {
    return null
  }

  return (
    <div className="rounded-md border text-sm">
      <div className="border-b p-3 font-medium">{t(($) => $.sendConfirmExpectedChanges)}</div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 px-3 text-xs">{t(($) => $.sendConfirmAddressLabel)}</TableHead>
            <TableHead className="h-8 px-3 text-xs">{t(($) => $.sendConfirmTokenLabel)}</TableHead>
            <TableHead className="h-8 px-3 text-right text-xs">{t(($) => $.sendConfirmChangeLabel)}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.address}:${row.tokenTitle}`}>
              <TableCell className="px-3 py-2 font-mono text-xs">
                <span title={row.address}>{ellipsify(row.address)}</span>
              </TableCell>
              <TableCell className="px-3 py-2 font-mono text-xs">
                <span title={row.tokenTitle}>{row.tokenLabel}</span>
              </TableCell>
              <TableCell className="px-3 py-2 text-right">
                <Badge
                  className="font-mono"
                  variant={row.change > 0n ? 'success' : row.change < 0n ? 'destructive' : 'outline'}
                >
                  {formatSimulatedTransactionChange({ change: row.change, decimals: row.decimals })}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function getSendConfirmChangeRows({
  mint,
  simulation,
}: {
  mint: TokenBalance
  simulation: Extract<SimulatePreparedTransactionResult, { status: 'success' }>
}) {
  return getSimulatedTransactionChangeRows({ simulation })
    .map(
      (row): SendConfirmChangeRow => ({
        address: row.address,
        change: row.change,
        decimals: row.decimals,
        tokenLabel: getSendConfirmChangeRowTokenLabel({ mint, row }),
        tokenTitle: row.mint,
      }),
    )
    .sort((rowA, rowB) => {
      const tokenSort = rowA.tokenLabel.localeCompare(rowB.tokenLabel)
      if (tokenSort !== 0) {
        return tokenSort
      }

      return rowA.address.localeCompare(rowB.address)
    })
}

export interface SendConfirmChangeRow {
  address: string
  change: bigint
  decimals: number
  tokenLabel: string
  tokenTitle: string
}

function getSendConfirmTokenLabel(mint: TokenBalance) {
  return mint.metadata?.symbol ?? (mint.mint === NATIVE_MINT ? 'SOL' : ellipsify(mint.mint))
}

function getSendConfirmChangeRowTokenLabel({ mint, row }: { mint: TokenBalance; row: SimulatedTransactionChangeRow }) {
  if (row.type === 'sol') {
    return getSolTokenLabel(mint)
  }

  return row.mint === mint.mint ? getSendConfirmTokenLabel(mint) : ellipsify(row.mint)
}

function getSolTokenLabel(mint: TokenBalance) {
  return mint.mint === NATIVE_MINT ? getSendConfirmTokenLabel(mint) : 'SOL'
}
