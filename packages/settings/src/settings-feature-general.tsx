import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { Link } from 'react-router'
import { useSettingsPage } from './data-access/use-settings-page.tsx'
import { SettingsFeatureGeneralApiEndpoint } from './settings-feature-general-api-endpoint.tsx'
import { SettingsFeatureGeneralDeveloperModeEnable } from './settings-feature-general-developer-mode-enable.tsx'
import { SettingsFeatureGeneralLanguage } from './settings-feature-general-language.tsx'
import { SettingsFeatureGeneralWarningAcceptExperimental } from './settings-feature-general-warning-accept-experimental.tsx'

export function SettingsFeatureGeneral() {
  const page = useSettingsPage({ pageId: 'general' })
  return (
    <div className="space-y-4">
      <UiCard contentProps={{ className: 'grid gap-4 space-y-4' }} description={page.description} title={page.name}>
        <SettingsFeatureGeneralLanguage />
        <SettingsFeatureGeneralApiEndpoint />
        <SettingsFeatureGeneralWarningAcceptExperimental />
        <SettingsFeatureGeneralDeveloperModeEnable />
      </UiCard>
      <UiCard className="border-red-500" contentProps={{ className: 'grid gap-6' }} title="Danger zone">
        <Button asChild variant="destructive">
          <Link to="/reset">Reset application</Link>
        </Button>
      </UiCard>
    </div>
  )
}
