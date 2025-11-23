import { useNetworkLive } from '@workspace/db-react/use-network-live'
import { useSetting } from '@workspace/db-react/use-setting'
import { useWalletLive } from '@workspace/db-react/use-wallet-live'
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
  const wallets = useWalletLive()
  const items = useNetworkLive()
  const [activeId, setActiveNetworkId] = useSetting('activeNetworkId')
  const activeNetwork = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])

  return (
    <Menubar className="py-2 h-10 md:h-14 bg-transparent border-none">
      {activeAccount && activeWallet ? (
        <ShellUiMenuWallets
          activeAccount={activeAccount}
          activeWallet={activeWallet}
          setActiveAccount={setActiveAccountId}
          wallets={wallets}
        />
      ) : null}
      {activeNetwork ? (
        <ShellUiMenuNetwork active={activeNetwork} networks={items} setActive={setActiveNetworkId} />
      ) : null}
      <ShellUiMenuDevelopment items={getDevOptions()} />
    </Menubar>
  )
}
