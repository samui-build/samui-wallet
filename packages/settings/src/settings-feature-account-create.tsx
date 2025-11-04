import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'

import { SettingsUiAccountCreateOptions } from './ui/settings-ui-account-create-options.tsx'

export function SettingsFeatureAccountCreate() {
  return (
    <UiCard
      title={
        <div className="flex items-center gap-2">
          <UiBack />
          Create Account
        </div>
      }
    >
      <SettingsUiAccountCreateOptions />
    </UiCard>
  )
}
