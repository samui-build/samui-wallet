import { useSettingsPage } from './data-access/use-settings-page.js'
import { SettingsFeatureGeneralDangerDeleteDatabase } from './settings-feature-general-danger-delete-database.js'
import { SettingsFeatureGeneralWarningAcceptExperimental } from './settings-feature-general-warning-accept-experimental.js'
import { SettingsUiPageCard } from './ui/settings-ui-page-card.js'

export function SettingsFeatureGeneral() {
  const page = useSettingsPage({ pageId: 'general' })
  return (
    <SettingsUiPageCard page={page}>
      <SettingsFeatureGeneralWarningAcceptExperimental />
      <div className="border border-red-500 rounded-md p-4">
        <SettingsFeatureGeneralDangerDeleteDatabase />
      </div>
    </SettingsUiPageCard>
  )
}
