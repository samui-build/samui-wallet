import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useAccountSetActive } from '@workspace/db-react/use-account-set-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useNetworkLive } from '@workspace/db-react/use-network-live'
import { useSetting } from '@workspace/db-react/use-setting'
import { useWalletActive } from '@workspace/db-react/use-wallet-active'
import { useWalletLive } from '@workspace/db-react/use-wallet-live'
import { getDevOptions } from '@workspace/dev/dev-features'
import { useGetSolanaNetworkFromGenesisHash } from '@workspace/solana-client-react/use-get-solana-network-from-genesis-hash'
import { Menubar } from '@workspace/ui/components/menubar'
import { toastError } from '@workspace/ui/lib/toast-error'
import { ShellUiMenuDevelopment } from './shell-ui-menu-development.tsx'
import { ShellUiMenuNetwork } from './shell-ui-menu-network.tsx'
import { ShellUiMenuWallets } from './shell-ui-menu-wallets.tsx'

export function ShellUiMenu() {
  const activeAccount = useAccountActive()
  const setActiveMutation = useAccountSetActive()
  const { mutateAsync } = useGetSolanaNetworkFromGenesisHash()

  const activeWallet = useWalletActive()
  const wallets = useWalletLive()

  const activeNetwork = useNetworkActive()
  const networks = useNetworkLive()
  const [, setActiveNetworkId] = useSetting('activeNetworkId')

  async function setNetwork(id: string) {
    const network = networks.find((currentNetwork) => currentNetwork.id === id)
    if (!network) {
      throw new Error(`Network with id ${id} not found`)
    }

    if (network.type === 'solana:localnet') {
      await mutateAsync(network.endpoint, {
        onError: () => {
          toastError('Failed to connect to network. Please ensure your local validator is running.')
        },
      })
    }

    setActiveNetworkId(id)
  }

  return (
    <Menubar className="h-10 border-none bg-transparent py-2 md:h-14">
      <ShellUiMenuWallets
        activeAccount={activeAccount}
        activeWallet={activeWallet}
        setActiveAccount={(id: string) => setActiveMutation.mutateAsync({ id })}
        wallets={wallets}
      />
      <ShellUiMenuNetwork active={activeNetwork} networks={networks} setActive={setNetwork} />
      <ShellUiMenuDevelopment items={getDevOptions()} />
    </Menubar>
  )
}
