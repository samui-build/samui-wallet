import type { Wallet } from '@workspace/db/entity/wallet'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucideCheck } from 'lucide-react'

import { WalletUiIcon } from './wallet-ui-icon.js'
import { WalletUiItem } from './wallet-ui-item.js'

export function SettingsUiWalletTable({
  active,
  deriveWallet,
  importWallet,
  items,
  setActive,
  watchWallet,
}: {
  active: null | Wallet
  deriveWallet: () => void
  importWallet: () => void
  items: Wallet[]
  setActive: (id: string) => Promise<void>
  watchWallet: () => void
}) {
  return (
    <div>
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Wallets</h2>
          <div className="flex gap-2">
            <Button onClick={importWallet} size="icon" variant="outline">
              <WalletUiIcon type="Imported" />
            </Button>
            <Button onClick={watchWallet} size="icon" variant="outline">
              <WalletUiIcon type="Watched" />
            </Button>
            <Button onClick={deriveWallet} size="icon" variant="outline">
              <WalletUiIcon type="Derived" />
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <WalletUiItem wallet={item} />
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
              <TableHead className="flex gap-2 justify-end">
                <UiTooltip content="Import wallet">
                  <Button onClick={importWallet} size="icon" variant="outline">
                    <WalletUiIcon type="Imported" />
                  </Button>
                </UiTooltip>
                <UiTooltip content="Watch wallet">
                  <Button onClick={watchWallet} size="icon" variant="outline">
                    <WalletUiIcon type="Watched" />
                  </Button>
                </UiTooltip>
                <UiTooltip content="Derive wallet">
                  <Button onClick={deriveWallet} size="icon" variant="outline">
                    <WalletUiIcon type="Derived" />
                  </Button>
                </UiTooltip>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <WalletUiItem wallet={item} />
                </TableCell>
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
