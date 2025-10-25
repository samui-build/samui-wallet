import type { AccountWithWallets } from '@workspace/db/db-account-find-many-with-wallets'
import type { Account } from '@workspace/db/entity/account'
import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useDbAccountFindManyWithWallets } from '@workspace/db-react/use-db-account-find-many-with-wallets'
import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useActiveAccount } from '@workspace/settings/data-access/use-active-account'
import { useActiveWallet } from '@workspace/settings/data-access/use-active-wallet'
import {
  Menubar,
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
import { LucideBug, LucideNetwork, LucideSettings } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'

export function DevFeatureUiMenu() {
  return <MenubarDemo />
}

export function MenubarDemo() {
  const { active: activeAccount, setActive: setActiveAccountId } = useActiveAccount()
  const { active: activeWallet, setActive: setActiveWalletId } = useActiveWallet()
  const accountsQuery = useDbAccountFindManyWithWallets({ input: {} })
  const items = useDbClusterLive()
  const [activeId, setActiveClusterId] = useDbPreference('activeClusterId')
  const activeCluster = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])

  const accounts: AccountWithWallets[] = accountsQuery.data ?? []

  return (
    <Menubar className="py-2  h-14">
      <MenubarDemoAccounts
        accounts={accounts}
        activeAccount={activeAccount}
        activeWallet={activeWallet}
        setActiveAccount={setActiveAccountId}
        setActiveWallet={setActiveWalletId}
      />
      <MenubarDemoCluster active={activeCluster} clusters={items} setActive={setActiveClusterId} />
      <MenubarDemoDevelopment
        items={[
          { label: 'Scratch Pad', path: '/dev/scratch-pad' },
          { label: 'DB', path: '/dev/db' },
          { label: 'Solana', path: '/dev/solana' },
          { label: 'UI', path: '/dev/ui' },
        ]}
      />
    </Menubar>
  )
}

export function MenubarDemoCluster({
  active,
  clusters,
  setActive,
}: {
  active: Cluster | undefined
  clusters: Cluster[]
  setActive: (id: string) => Promise<void>
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger className="gap-2 px-4 h-12">
        <LucideNetwork />
        {active?.name ?? 'Select Cluster'}
      </MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup onValueChange={(id) => setActive(id)} value={active?.id ?? ''}>
          {clusters
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((cluster) => (
              <MenubarRadioItem key={cluster.id} value={cluster.id}>
                {cluster.name}
              </MenubarRadioItem>
            ))}
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarItem asChild>
          <Link to="/settings/clusters">
            <LucideSettings />
            Cluster settings
          </Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

function MenubarDemoAccounts({
  accounts,
  activeAccount,
  activeWallet,
  setActiveAccount,
  setActiveWallet,
}: {
  accounts: AccountWithWallets[]
  activeAccount: Account | null
  activeWallet: null | Wallet
  setActiveAccount: (id: string) => Promise<void>
  setActiveWallet: (id: string) => Promise<void>
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger className="py-2 gap-2 h-12 min-w-[150px]">
        <UiAvatar label={activeAccount?.name ?? ''} />
        {activeWallet?.name ?? ''}
      </MenubarTrigger>
      <MenubarContent>
        {accounts.map((account) => {
          return (
            <MenubarSub key={account.id}>
              <MenubarSubTrigger className="gap-2" onClick={() => setActiveAccount(account.id)}>
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

function MenubarDemoDevelopment({ items }: { items: { label: string; path: string }[] }) {
  const [developerMode] = useDbPreference('developerModeEnabled')
  return developerMode === 'true' ? (
    <MenubarMenu>
      <MenubarTrigger className="gap-2 h-12 px-4">
        <LucideBug />
        Development
      </MenubarTrigger>
      <MenubarContent>
        {items.map((item) => (
          <MenubarItem asChild key={item.label}>
            <Link to={item.path}>{item.label}</Link>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  ) : null
}
