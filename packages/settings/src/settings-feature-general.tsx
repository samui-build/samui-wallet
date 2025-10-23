import { UiCard } from '@workspace/ui/components/ui-card'

import { useSettingsPage } from './data-access/use-settings-page.js'
import { SettingsFeatureGeneralDangerDeleteDatabase } from './settings-feature-general-danger-delete-database.js'
import {
  SettingsFeatureGeneralDeveloperModeEnable,
  SettingsFeatureGeneralWarningAcceptExperimental,
} from './settings-feature-general-warning-accept-experimental.js'

export function SettingsFeatureGeneral() {
  const page = useSettingsPage({ pageId: 'general' })
  return (
    <UiCard contentProps={{ className: 'grid gap-6' }} description={page.description} title={page.name}>
      <SettingsFeatureGeneralWarningAcceptExperimental />
      <SettingsFeatureGeneralDeveloperModeEnable />
      <div className="border border-red-500 rounded-md p-4">
        <SettingsFeatureGeneralDangerDeleteDatabase />
      </div>
    </UiCard>
  )
}
