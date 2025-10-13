import type { Wallet } from '@workspace/db/entity/wallet'

import { Button } from '@workspace/ui/components/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { LucidePlus } from 'lucide-react'

export function SettingsUiWalletTable({ deriveWallet, items }: { deriveWallet: () => void; items: Wallet[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[20px]">#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>PublicKey</TableHead>
          <TableHead className="flex justify-end pr-0">
            <Button onClick={deriveWallet} size="sm" variant="outline">
              <LucidePlus /> Derive Wallet
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.derivationIndex}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell className="font-mono text-xs" colSpan={2}>
              {item.publicKey}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
