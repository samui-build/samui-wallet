import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { SettingsUiWalletCreateOptions } from './ui/settings-ui-wallet-create-options.tsx'

export function SettingsFeatureWalletCreate() {
  const { t } = useTranslation('settings')
  return (
    <UiCard backButtonTo=".." title={t(($) => $.walletPageAddTitle)}>
      <SettingsUiWalletCreateOptions />
    </UiCard>
  )
}
