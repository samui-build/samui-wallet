import { useTranslation } from '@workspace/i18n'
import type { GetTokenAccountsResult } from '@workspace/solana-client/get-token-accounts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { formatBalance } from '../data-access/format-balance.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiProgramLabel } from './explorer-ui-program-label.tsx'

export function ExplorerUiTokenTable({ basePath, items }: { basePath: string; items: GetTokenAccountsResult }) {
  const { t } = useTranslation('explorer')
  return items.length ? (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{t(($) => $.mint)}</TableHead>
          <TableHead>{t(($) => $.owner)}</TableHead>
          <TableHead>{t(($) => $.account)}</TableHead>
          <TableHead className="w-[120px] text-right">{t(($) => $.amount)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.pubkey}>
            <TableCell className="md:w-[350px]">
              <ExplorerUiLinkAddress
                address={item.account.data.parsed.info.mint}
                basePath={basePath}
                className="text-xs"
              />
            </TableCell>
            <TableCell>
              <ExplorerUiLinkAddress
                address={item.account.owner}
                basePath={basePath}
                className="text-xs"
                label={<ExplorerUiProgramLabel address={item.account.owner} />}
              />
            </TableCell>
            <TableCell className="md:w-[350px]">
              <ExplorerUiLinkAddress address={item.pubkey} basePath={basePath} className="text-xs" />
            </TableCell>
            <TableCell className="text-right">
              {formatBalance({
                balance: BigInt(item.account.data.parsed.info.tokenAmount.amount),
                decimals: item.account.data.parsed.info.tokenAmount.decimals,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <UiEmpty description={t(($) => $.accountTokensEmpty)} />
  )
}
