import { useTranslation } from '@workspace/i18n'
import type { GetTransactionResult } from '@workspace/solana-client/get-transaction'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { ExplorerUiBalanceDiff } from './explorer-ui-balance-diff.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiProgramLabel } from './explorer-ui-program-label.tsx'

export function ExplorerUiTxTokenBalances({ basePath, tx }: { basePath: string; tx: GetTransactionResult }) {
  const { t } = useTranslation('explorer')
  if (!tx) {
    return null
  }
  const accountKeys = tx.transaction.message.accountKeys ?? []
  const preTokenBalances = tx.meta?.preTokenBalances
  const postTokenBalances = tx.meta?.postTokenBalances
  if (!postTokenBalances?.length || !preTokenBalances?.length) {
    return null
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{t(($) => $.address)}</TableHead>
          <TableHead>{t(($) => $.token)}</TableHead>
          <TableHead className="text-right">{t(($) => $.change)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {postTokenBalances.map((item) => {
          const token = accountKeys[item.accountIndex]?.pubkey
          const decimals = item.uiTokenAmount.decimals ?? 0
          const postBalance = BigInt(item.uiTokenAmount.amount)
          const preBalance = BigInt(
            preTokenBalances.find((pre) => pre.accountIndex === item.accountIndex)?.uiTokenAmount.amount ?? 0n,
          )
          return (
            <TableRow key={item.accountIndex.toString()}>
              <TableCell className="md:w-[350px]">
                {token ? (
                  <ExplorerUiLinkAddress
                    address={token}
                    basePath={basePath}
                    className="text-xs"
                    label={<ExplorerUiProgramLabel address={token} />}
                  />
                ) : null}
              </TableCell>
              <TableCell className="font-mono md:w-[100px]">
                <ExplorerUiLinkAddress
                  address={item.mint}
                  basePath={basePath}
                  className="text-xs"
                  label={<ExplorerUiProgramLabel address={item.mint} />}
                />
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                <ExplorerUiBalanceDiff decimals={decimals} post={postBalance} pre={preBalance} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
