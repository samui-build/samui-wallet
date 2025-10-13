import type { Wallet } from '@workspace/db/entity/wallet'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'

export function SettingsUiWalletTable({ items }: { items: Wallet[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20px]">#</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.derivationIndex}</TableCell>
            <TableCell>{item.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
