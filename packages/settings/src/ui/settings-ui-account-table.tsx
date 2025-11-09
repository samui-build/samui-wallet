import type { Account } from '@workspace/db/entity/account'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

import { AccountUiItem } from './account-ui-item.tsx'

export function SettingsUiAccountTable({ items }: { items: Account[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[50px]">Name</TableHead>
          <TableHead>Public Key</TableHead>
          <TableHead className="w-[50px]">Type</TableHead>
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
              <span className="lg:hidden">
                <UiTooltip content={item.publicKey}>{ellipsify(item.publicKey, 6, '...')}</UiTooltip>
              </span>
            </TableCell>
            <TableCell className="font-mono text-xs">{item.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
