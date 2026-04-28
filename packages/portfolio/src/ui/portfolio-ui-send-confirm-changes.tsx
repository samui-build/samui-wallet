import { formatBalance } from '@workspace/explorer/data-access/format-balance'
import { useTranslation } from '@workspace/i18n'
import { NATIVE_MINT, TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { Badge } from '@workspace/ui/components/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import type { PortfolioPreparedTransaction } from '../data-access/use-portfolio-tx-prepare.tsx'
import { getInstructionAccountAddress } from './portfolio-ui-send-confirm-instruction.tsx'

export function PortfolioUiSendConfirmChanges({
  mint,
  preparedTransaction,
  recipients,
}: {
  mint: TokenBalance
  preparedTransaction: PortfolioPreparedTransaction | undefined
  recipients: TransferRecipient[]
}) {
  const { t } = useTranslation('portfolio')

  if (!preparedTransaction) {
    return null
  }

  const rows = getSendConfirmChangeRows({ mint, preparedTransaction, recipients })
  const tokenLabel = getSendConfirmTokenLabel(mint)

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
            <TableRow key={row.address}>
              <TableCell className="px-3 py-2 font-mono text-xs">
                <span title={row.address}>{ellipsify(row.address)}</span>
              </TableCell>
              <TableCell className="px-3 py-2 font-mono text-xs">
                <span title={mint.mint}>{tokenLabel}</span>
              </TableCell>
              <TableCell className="px-3 py-2 text-right">
                <Badge
                  className="font-mono"
                  variant={row.change > 0n ? 'success' : row.change < 0n ? 'destructive' : 'outline'}
                >
                  {formatTokenChange({ change: row.change, decimals: mint.decimals })}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function getSendConfirmChangeRows({
  mint,
  preparedTransaction,
  recipients,
}: {
  mint: TokenBalance
  preparedTransaction: PortfolioPreparedTransaction
  recipients: TransferRecipient[]
}) {
  const rows = new Map<string, SendConfirmChangeRow>()
  const transferInstructions = preparedTransaction.instructions.filter(
    (instruction) =>
      instruction.programAddress === TOKEN_PROGRAM_ADDRESS || instruction.programAddress === TOKEN_2022_PROGRAM_ADDRESS,
  )

  for (const [index, { amount, destination }] of recipients.entries()) {
    if (mint.mint === NATIVE_MINT) {
      addChangeRow(rows, preparedTransaction.transactionSigner.address, -amount)
      addChangeRow(rows, destination, amount)
      continue
    }

    const transferInstruction = transferInstructions[index]
    const source =
      getInstructionAccountAddress(transferInstruction?.accounts?.[0]) ?? preparedTransaction.transactionSigner.address
    const tokenDestination = getInstructionAccountAddress(transferInstruction?.accounts?.[2]) ?? destination

    addChangeRow(rows, source, -amount)
    addChangeRow(rows, tokenDestination, amount)
  }

  return [...rows.values()]
}

interface SendConfirmChangeRow {
  address: string
  change: bigint
}

function addChangeRow(rows: Map<string, SendConfirmChangeRow>, address: string, change: bigint) {
  rows.set(address, {
    address,
    change: (rows.get(address)?.change ?? 0n) + change,
  })
}

function formatTokenChange({ change, decimals }: { change: bigint; decimals: number }) {
  return `${change > 0n ? '+' : ''}${formatBalance({ balance: change, decimals })}`
}

function getSendConfirmTokenLabel(mint: TokenBalance) {
  return mint.mint === NATIVE_MINT ? (mint.metadata?.symbol ?? 'SOL') : ellipsify(mint.mint)
}
