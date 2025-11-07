import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbNetworkLive } from '@workspace/db-react/use-db-network-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { getDevOptions } from '@workspace/dev/dev-features'
import { useActiveAccount } from '@workspace/settings/data-access/use-active-account'
import { useActiveWallet } from '@workspace/settings/data-access/use-active-wallet'
import { Menubar } from '@workspace/ui/components/menubar'
import { useMemo } from 'react'

import { ShellUiMenuAccounts } from './shell-ui-menu-accounts.tsx'
import { ShellUiMenuDevelopment } from './shell-ui-menu-development.tsx'
import { ShellUiMenuNetwork } from './shell-ui-menu-network.tsx'

export function ShellUiMenu() {
  const { active: activeAccount } = useActiveAccount()
  const { active: activeWallet, setActive: setActiveWalletId } = useActiveWallet()
  const accounts = useDbAccountLive()
  const items = useDbNetworkLive()
  const [activeId, setActiveNetworkId] = useDbSetting('activeNetworkId')
  const activeNetwork = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])

  return (
    <Menubar className="py-2 h-10 md:h-14 bg-transparent border-none">
      <ShellUiMenuAccounts
        accounts={accounts}
        activeAccount={activeAccount}
        activeWallet={activeWallet}
        setActiveWallet={setActiveWalletId}
      />
      <ShellUiMenuNetwork active={activeNetwork} networks={items} setActive={setActiveNetworkId} />
      <ShellUiMenuDevelopment items={getDevOptions()} />
    </Menubar>
  )
}
