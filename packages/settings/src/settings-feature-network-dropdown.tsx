import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useNetworkLive } from '@workspace/db-react/use-network-live'
import { useSetting } from '@workspace/db-react/use-setting'

import { SettingsUiNetworkDropdown } from './ui/settings-ui-network-dropdown.tsx'

export function SettingsFeatureNetworkDropdown() {
  const networks = useNetworkLive()
  const [, setActiveNetworkId] = useSetting('activeNetworkId')
  const activeNetwork = useNetworkActive()
  return <SettingsUiNetworkDropdown activeNetwork={activeNetwork} items={networks} setActive={setActiveNetworkId} />
}
