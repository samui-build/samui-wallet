import { useActiveAccount } from './data-access/use-active-account.js'
import { SettingsUiAccountDropdown } from './ui/settings-ui-account-dropdown.js'

export function SettingsFeatureAccountDropdown() {
  const { accounts, active, setActive } = useActiveAccount()
  return <SettingsUiAccountDropdown active={active} items={accounts} setActive={setActive} />
}
