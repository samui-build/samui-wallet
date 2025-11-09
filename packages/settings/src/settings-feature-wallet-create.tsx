import { UiCard } from '@workspace/ui/components/ui-card'

import { SettingsUiWalletCreateOptions } from './ui/settings-ui-wallet-create-options.tsx'

export function SettingsFeatureWalletCreate() {
  return (
    <UiCard backButtonTo=".." title="Create Wallet">
      <SettingsUiWalletCreateOptions />
    </UiCard>
  )
}
