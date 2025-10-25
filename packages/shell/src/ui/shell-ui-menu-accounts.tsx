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
import { LucideSettings } from 'lucide-react'
import { Link } from 'react-router'

export function ShellUiMenuAccounts({
  accounts,
  activeAccount,
  activeWallet,
  setActiveWallet,
}: {
  accounts: Account[]
  activeAccount: Account | null
  activeWallet: null | Wallet
  setActiveWallet: (id: string) => Promise<void>
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger className="py-2 gap-2 h-8 md:h-12 px-1 md:px-2 md:min-w-[150px]">
        <UiAvatar className="size-6 md:size-8" label={activeAccount?.name ?? ''} />
        {activeWallet?.name ?? ''}
      </MenubarTrigger>
      <MenubarContent>
        {accounts.map((account) => {
          return (
            <MenubarSub key={account.id}>
              <MenubarSubTrigger className="gap-2">
                <UiAvatar label={account.name} />
                {account.name}
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarRadioGroup onValueChange={(id) => setActiveWallet(id)} value={activeWallet?.id ?? ''}>
                  {account.wallets.map((wallet) => (
                    <MenubarRadioItem key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </MenubarRadioItem>
                  ))}
                </MenubarRadioGroup>
              </MenubarSubContent>
            </MenubarSub>
          )
        })}

        <MenubarSeparator />
        <MenubarItem asChild>
          <Link to="/settings/accounts">
            <LucideSettings />
            Account settings
          </Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
