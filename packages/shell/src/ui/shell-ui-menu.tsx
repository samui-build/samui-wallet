import type { Account } from '@workspace/db/entity/account'

import { useDbAccountFindMany } from '@workspace/db-react/use-db-account-find-many'
import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { getDevOptions } from '@workspace/dev/dev-features'
import { useActiveAccount } from '@workspace/settings/data-access/use-active-account'
import { useActiveWallet } from '@workspace/settings/data-access/use-active-wallet'
import { Menubar } from '@workspace/ui/components/menubar'
import { useMemo } from 'react'

import { ShellUiMenuAccounts } from './shell-ui-menu-accounts.js'
import { ShellUiMenuCluster } from './shell-ui-menu-cluster.js'
import { ShellUiMenuDevelopment } from './shell-ui-menu-development.js'

export function ShellUiMenu() {
  const { active: activeAccount } = useActiveAccount()
  const { active: activeWallet, setActive: setActiveWalletId } = useActiveWallet()
  const accountsQuery = useDbAccountFindMany({ input: {} })
  const items = useDbClusterLive()
  const [activeId, setActiveClusterId] = useDbPreference('activeClusterId')
  const activeCluster = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])

  const accounts: Account[] = accountsQuery.data ?? []

  return (
    <Menubar className="py-2 h-10 md:h-14 bg-transparent border-none">
      <ShellUiMenuAccounts
        accounts={accounts}
        activeAccount={activeAccount}
        activeWallet={activeWallet}
        setActiveWallet={setActiveWalletId}
      />
      <ShellUiMenuCluster active={activeCluster} clusters={items} setActive={setActiveClusterId} />
      <ShellUiMenuDevelopment items={getDevOptions()} />
    </Menubar>
  )
}
