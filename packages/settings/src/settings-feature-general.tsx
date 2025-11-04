import { UiCard } from '@workspace/ui/components/ui-card'

import { useSettingsPage } from './data-access/use-settings-page.tsx'
import { SettingsFeatureGeneralApiEndpoint } from './settings-feature-general-api-endpoint.tsx'
import { SettingsFeatureGeneralDangerDeleteDatabase } from './settings-feature-general-danger-delete-database.tsx'
import { SettingsFeatureGeneralDeveloperModeEnable } from './settings-feature-general-developer-mode-enable.tsx'
import { SettingsFeatureGeneralWarningAcceptExperimental } from './settings-feature-general-warning-accept-experimental.tsx'

export function SettingsFeatureGeneral() {
  const page = useSettingsPage({ pageId: 'general' })
  return (
    <UiCard contentProps={{ className: 'grid gap-6' }} description={page.description} title={page.name}>
      <SettingsFeatureGeneralApiEndpoint />
      <SettingsFeatureGeneralWarningAcceptExperimental />
      <SettingsFeatureGeneralDeveloperModeEnable />
      <div className="border border-red-500 rounded-md p-4">
        <SettingsFeatureGeneralDangerDeleteDatabase />
      </div>
    </UiCard>
  )
}
