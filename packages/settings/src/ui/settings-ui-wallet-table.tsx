import type { Wallet } from '@workspace/db/entity/wallet'

import { Button } from '@workspace/ui/components/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucideCheck, LucidePlus } from 'lucide-react'

export function SettingsUiWalletTable({
  activeId,
  deriveWallet,
  items,
  setActive,
}: {
  activeId: null | string
  deriveWallet: () => void
  items: Wallet[]
  setActive: (item: Wallet) => Promise<void>
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[20px]">#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>PublicKey</TableHead>
          <TableHead className="flex justify-end">
            <Button onClick={deriveWallet} size="icon" variant="outline">
              <LucidePlus />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.derivationIndex}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell className="font-mono text-xs">{item.publicKey}</TableCell>
            <TableCell>
              {activeId === item.id ? null : (
                <UiTooltip content="Set as active">
                  <Button onClick={() => setActive(item)} size="icon" variant="outline">
                    <LucideCheck className="text-green-500 size-4" />
                  </Button>
                </UiTooltip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
