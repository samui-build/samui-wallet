import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { getDevOptions } from '@workspace/dev/dev-features'
import { useActiveAccount } from '@workspace/settings/data-access/use-active-account'
import { useActiveWallet } from '@workspace/settings/data-access/use-active-wallet'
import { Menubar } from '@workspace/ui/components/menubar'
import { useMemo } from 'react'

import { ShellUiMenuAccounts } from './shell-ui-menu-accounts.tsx'
import { ShellUiMenuCluster } from './shell-ui-menu-cluster.tsx'
import { ShellUiMenuDevelopment } from './shell-ui-menu-development.tsx'

export function ShellUiMenu() {
  const { active: activeAccount } = useActiveAccount()
  const { active: activeWallet, setActive: setActiveWalletId } = useActiveWallet()
  const accounts = useDbAccountLive()
  const items = useDbClusterLive()
  const [activeId, setActiveClusterId] = useDbSetting('activeClusterId')
  const activeCluster = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])

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
