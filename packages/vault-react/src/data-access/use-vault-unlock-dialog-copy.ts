import { useTranslation } from '@workspace/i18n'

export function useVaultUnlockDialogCopy() {
  const { t } = useTranslation('vault-react')

  return {
    actionCancel: t(($) => $.unlockDialogActionCancel),
    actionContinue: t(($) => $.unlockDialogActionContinue),
    confirmPasswordLabel: t(($) => $.unlockDialogConfirmPasswordLabel),
    defaultDescription: t(($) => $.unlockDialogDefaultDescription),
    defaultTitle: t(($) => $.unlockDialogDefaultTitle),
    passwordLabel: t(($) => $.unlockDialogPasswordLabel),
    pinLabel: t(($) => $.unlockDialogPinLabel),
    setupDescription: t(($) => $.unlockDialogSetupDescription),
    setupTitle: t(($) => $.unlockDialogSetupTitle),
  }
}
