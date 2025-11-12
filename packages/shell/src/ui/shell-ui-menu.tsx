import { useDbNetworkLive } from '@workspace/db-react/use-db-network-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { getDevOptions } from '@workspace/dev/dev-features'
import { useActiveAccount } from '@workspace/settings/data-access/use-active-account'
import { useActiveWallet } from '@workspace/settings/data-access/use-active-wallet'
import { Menubar } from '@workspace/ui/components/menubar'
import { useMemo } from 'react'
import { ShellUiMenuDevelopment } from './shell-ui-menu-development.tsx'
import { ShellUiMenuNetwork } from './shell-ui-menu-network.tsx'
import { ShellUiMenuWallets } from './shell-ui-menu-wallets.tsx'

export function ShellUiMenu() {
  const { active: activeWallet } = useActiveWallet()
  const { active: activeAccount, setActive: setActiveAccountId } = useActiveAccount()
  const wallets = useDbWalletLive()
  const items = useDbNetworkLive()
  const [activeId, setActiveNetworkId] = useDbSetting('activeNetworkId')
  const activeNetwork = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])

  return (
    <Menubar className="py-2 h-10 md:h-14 bg-transparent border-none">
      <ShellUiMenuWallets
        activeAccount={activeAccount}
        activeWallet={activeWallet}
        setActiveAccount={setActiveAccountId}
        wallets={wallets}
      />
      <ShellUiMenuNetwork active={activeNetwork} networks={items} setActive={setActiveNetworkId} />
      <ShellUiMenuDevelopment items={getDevOptions()} />
    </Menubar>
  )
}
