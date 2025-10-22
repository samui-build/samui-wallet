import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { useMemo } from 'react'

import { SettingsUiWalletDropdown } from './ui/settings-ui-wallet-dropdown.js'

export function SettingsFeatureWalletDropdown() {
  const items = useDbWalletLive()
  const [activeWalletId, setActiveId] = useDbPreference('activeWalletId')
  const activeWallet = useMemo(() => items.find((c) => c.id === activeWalletId), [items, activeWalletId])
  return <SettingsUiWalletDropdown activeWallet={activeWallet} items={items} setActive={setActiveId} />
}
