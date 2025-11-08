import type { Account } from '@workspace/db/entity/account'
import type { Wallet } from '@workspace/db/entity/wallet'

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@workspace/ui/components/menubar'
import { UiAvatar } from '@workspace/ui/components/ui-avatar'
import { cn } from '@workspace/ui/lib/utils'
import { LucidePencil, LucidePlus, LucideSettings } from 'lucide-react'
import { Link } from 'react-router'

export function ShellUiMenuWallets({
  wallets,
  activeWallet,
  activeAccount,
  setActiveAccount,
}: {
  wallets: Wallet[]
  activeWallet: Wallet | null
  activeAccount: null | Account
  setActiveAccount: (id: string) => Promise<void>
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger className="py-2 gap-2 h-8 md:h-12 px-1 md:px-2 md:min-w-[150px]">
        <UiAvatar className="size-6 md:size-8" label={activeWallet?.name ?? ''} />
        {activeAccount?.name ?? ''}
      </MenubarTrigger>
      <MenubarContent>
        {wallets.map((wallet) => {
          return (
            <MenubarSub key={wallet.id}>
              <MenubarSubTrigger className="gap-2">
                <UiAvatar label={wallet.name} />
                {wallet.name}
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarRadioGroup onValueChange={(id) => setActiveAccount(id)} value={activeAccount?.id ?? ''}>
                  {wallet.accounts.map((account) => (
                    <MenubarRadioItem
                      className={cn('font-mono', {
                        'font-bold': account.id === activeAccount?.id,
                      })}
                      key={account.id}
                      value={account.id}
                    >
                      {account.name}
                    </MenubarRadioItem>
                  ))}
                </MenubarRadioGroup>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <Link to={`/settings/wallets/${wallet.id}/add`}>
                    <LucidePlus />
                    Add account
                  </Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link to={`/settings/wallets/${wallet.id}/edit`}>
                    <LucidePencil />
                    Edit wallet
                  </Link>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          )
        })}

        <MenubarSeparator />
        <MenubarItem asChild>
          <Link to="/settings/wallets">
            <LucideSettings />
            Wallet settings
          </Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
