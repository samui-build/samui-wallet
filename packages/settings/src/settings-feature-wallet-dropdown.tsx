import { useActiveWallet } from './data-access/use-active-wallet.tsx'
import { SettingsUiWalletDropdown } from './ui/settings-ui-wallet-dropdown.tsx'

export function SettingsFeatureWalletDropdown() {
  const { active, setActive, wallets } = useActiveWallet()
  return <SettingsUiWalletDropdown active={active} items={wallets} setActive={setActive} />
}
