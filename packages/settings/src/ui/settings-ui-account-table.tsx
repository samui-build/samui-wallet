import type { Account } from '@workspace/db/account/account'
import { useTranslation } from '@workspace/i18n'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { AccountTypeLabel } from './account-type-label.tsx'
import { AccountUiItem } from './account-ui-item.tsx'
import { SettingsUiExportAccountSecretKey } from './settings-ui-export-account-secret-key.tsx'

export function SettingsUiAccountTable({ items }: { items: Account[] }) {
  const { t } = useTranslation('settings')
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[50px]">{t(($) => $.accountTableHeaderName)}</TableHead>
          <TableHead>{t(($) => $.accountTableHeaderPublicKey)}</TableHead>
          <TableHead className="w-[50px]">{t(($) => $.accountTableHeaderType)}</TableHead>
          <TableHead className="w-[120px] text-right">{t(($) => $.accountTableHeaderActions)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <AccountUiItem account={item} />
            </TableCell>
            <TableCell className="font-mono text-xs">
              <span className="hidden lg:block">{item.publicKey}</span>
              <span className="lg:hidden" title={item.publicKey}>
                {ellipsify(item.publicKey, 6, '...')}
              </span>
            </TableCell>
            <TableCell className="font-mono text-xs">
              <AccountTypeLabel type={item.type} />
            </TableCell>
            <TableCell className="text-right">
              <SettingsUiExportAccountSecretKey account={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
