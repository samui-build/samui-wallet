import { useTranslation } from '@workspace/i18n'
import { SettingsUiWalletCreateComingSoon } from './settings-ui-wallet-create-coming-soon.tsx'
import { SettingsUiWalletCreateHeader } from './settings-ui-wallet-create-header.tsx'
import { SettingsUiWalletCreateLink } from './settings-ui-wallet-create-link.tsx'

export function SettingsUiWalletCreateOptions() {
  const { t } = useTranslation('settings')
  return (
    <div className="grid gap-4">
      <SettingsUiWalletCreateHeader icon="mnemonic" label={t(($) => $.walletCreateHeaderSeed)} />
      <SettingsUiWalletCreateLink
        description={t(($) => $.walletCreateGenerateDescription)}
        title={t(($) => $.walletCreateGenerateTitle)}
        to="/settings/wallets/generate"
      />
      <SettingsUiWalletCreateLink
        description={t(($) => $.walletCreateImportDescription)}
        title={t(($) => $.walletCreateImportTitle)}
        to="/settings/wallets/import"
      />
      <SettingsUiWalletCreateHeader icon="hardware" label={t(($) => $.walletCreateHeaderHardware)} />
      <SettingsUiWalletCreateComingSoon
        description={t(($) => $.walletCreateHardwareUnruggableDescription)}
        title={t(($) => $.walletCreateHardwareUnruggableTitle)}
      />
    </div>
  )
}
