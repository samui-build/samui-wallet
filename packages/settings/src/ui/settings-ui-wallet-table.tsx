import type { Wallet } from '@workspace/db/entity/wallet'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucideCheck, LucidePlus } from 'lucide-react'

export function SettingsUiWalletTable({
  active,
  deriveWallet,
  items,
  setActive,
}: {
  active: null | Wallet
  deriveWallet: () => void
  items: Wallet[]
  setActive: (id: string) => Promise<void>
}) {
  return (
    <div>
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Wallets</h2>
          <Button onClick={deriveWallet} size="icon" variant="outline">
            <LucidePlus />
          </Button>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {active?.id === item.id ? (
                    <UiTooltip content="Active wallet">
                      <Button size="icon" variant="secondary">
                        <LucideCheck className="text-green-500 size-4" />
                      </Button>
                    </UiTooltip>
                  ) : (
                    <UiTooltip content="Set as active">
                      <Button onClick={() => setActive(item.id)} size="icon" variant="outline">
                        <LucideCheck className="size-4" />
                      </Button>
                    </UiTooltip>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-xs break-all">{item.publicKey}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Public Key</TableHead>
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
                <TableCell>{item.name}</TableCell>
                <TableCell className="font-mono text-xs">{item.publicKey}</TableCell>
                <TableCell className="text-right">
                  {active?.id === item.id ? (
                    <UiTooltip content="Active wallet">
                      <Button size="icon" variant="secondary">
                        <LucideCheck className="text-green-500 size-4" />
                      </Button>
                    </UiTooltip>
                  ) : (
                    <UiTooltip content="Set as active">
                      <Button onClick={() => setActive(item.id)} size="icon" variant="outline">
                        <LucideCheck className="size-4" />
                      </Button>
                    </UiTooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
