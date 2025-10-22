import { useActiveWallet } from './data-access/use-active-wallet.js'
import { SettingsUiWalletDropdown } from './ui/settings-ui-wallet-dropdown.js'

export function SettingsFeatureWalletDropdown() {
  const { active, setActive, wallets } = useActiveWallet()
  return <SettingsUiWalletDropdown active={active} items={wallets} setActive={setActive} />
}
