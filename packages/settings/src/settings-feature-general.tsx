import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { Link } from 'react-router'
import { useSettingsPage } from './data-access/use-settings-page.tsx'
import { SettingsFeatureGeneralApiSettings } from './settings-feature-general-api-settings.tsx'
import { SettingsFeatureGeneralLanguage } from './settings-feature-general-language.tsx'
import { SettingsFeatureGeneralTheme } from './settings-feature-general-theme.tsx'
import { SettingsFeatureGeneralWarningAcceptExperimental } from './settings-feature-general-warning-accept-experimental.tsx'

export function SettingsFeatureGeneral() {
  const { t } = useTranslation('settings')
  const page = useSettingsPage({ pageId: 'general' })
  return (
    <div className="space-y-2 md:space-y-4">
      <UiCard
        contentProps={{ className: 'space-y-2 md:space-y-6 md:py-2' }}
        description={page.description}
        title={page.name}
      >
        <SettingsFeatureGeneralLanguage />
        <SettingsFeatureGeneralTheme />
        <SettingsFeatureGeneralWarningAcceptExperimental />
      </UiCard>
      <UiCard contentProps={{ className: 'space-y-2 md:space-y-6 md:py-2' }} title={t(($) => $.pageGeneralApiSettings)}>
        <SettingsFeatureGeneralApiSettings />
      </UiCard>
      <UiCard
        className="border-red-500"
        contentProps={{ className: 'grid gap-6' }}
        title={t(($) => $.pageGeneralDangerZone)}
      >
        <Button asChild variant="destructive">
          <Link to="/reset">{t(($) => $.pageGeneralReset)}</Link>
        </Button>
      </UiCard>
    </div>
  )
}
