import { useActiveAccount } from './data-access/use-active-account.tsx'
import { SettingsUiAccountDropdown } from './ui/settings-ui-account-dropdown.tsx'

export function SettingsFeatureAccountDropdown() {
  const { accounts, active, setActive } = useActiveAccount()
  return <SettingsUiAccountDropdown active={active} items={accounts} setActive={setActive} />
}
