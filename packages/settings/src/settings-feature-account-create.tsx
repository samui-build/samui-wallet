import { UiCard } from '@workspace/ui/components/ui-card'

import { SettingsUiAccountCreateOptions } from './ui/settings-ui-account-create-options.tsx'

export function SettingsFeatureAccountCreate() {
  return (
    <UiCard backButtonTo=".." title="Create Account">
      <SettingsUiAccountCreateOptions />
    </UiCard>
  )
}
