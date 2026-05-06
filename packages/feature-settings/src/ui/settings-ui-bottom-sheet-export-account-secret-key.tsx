import type { Account } from '@workspace/db/account/account'
import { useAccountReadSecretKey } from '@workspace/db-react/use-account-read-secret-key'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { useState } from 'react'
import { SettingsUiExportConfirm } from './settings-ui-export-confirm.tsx'
import { SettingsUiMnemonicBlur } from './settings-ui-mnemonic-blur.tsx'

export function SettingsUiBottomSheetExportAccountSecretKey({
  account,
  open,
  setOpen,
}: {
  account: Account
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const { t } = useTranslation('settings')
  const [revealed, setRevealed] = useState(false)
  const readSecretKeyMutation = useAccountReadSecretKey()

  return (
    <UiBottomSheet
      description={t(($) => $.exportSecretKeyCopyConfirmDescription)}
      onOpenChange={(value) => setOpen(value)}
      open={open}
      title={t(($) => $.exportSecretKeyCopyConfirmTitle)}
    >
      <div className="px-4 pb-4">
        {readSecretKeyMutation?.data?.length ? (
          <div className="space-y-2 text-center">
            <SettingsUiMnemonicBlur revealed={revealed} value={readSecretKeyMutation.data} />
            <div className="space-x-2">
              <Button onClick={() => setRevealed((val) => !val)} variant="secondary">
                <UiIcon icon="watch" />
                {revealed ? t(($) => $.exportSecretKeyHide) : t(($) => $.exportSecretKeyReveal)}
              </Button>
              <UiTextCopyButton
                label={t(($) => $.exportSecretKeyCopy)}
                text={readSecretKeyMutation.data}
                toast={t(($) => $.exportSecretKeyCopyCopied)}
              />
            </div>
          </div>
        ) : (
          <SettingsUiExportConfirm
            confirm={() => readSecretKeyMutation.mutateAsync({ id: account.id })}
            label={t(($) => $.exportSecretKeyShow)}
          />
        )}
      </div>
    </UiBottomSheet>
  )
}
