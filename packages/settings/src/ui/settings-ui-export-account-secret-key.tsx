import type { Account } from '@workspace/db/account/account'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Fragment, useState } from 'react'
import { SettingsUiExportAccountSecretKeySheet } from './settings-ui-export-account-secret-key-sheet.tsx'

export function SettingsUiExportAccountSecretKey({ account }: { account: Account }) {
  const { t } = useTranslation('settings')
  const [open, setOpen] = useState(false)
  return (
    <Fragment>
      <Button
        disabled={account.type === 'Watched'}
        onClick={() => setOpen((value) => !value)}
        size="icon"
        title={t(($) => $.exportSecretKeyCopy)}
        variant="outline"
      >
        <UiIcon className="size-4" icon="key" />
      </Button>
      <SettingsUiExportAccountSecretKeySheet account={account} open={open} setOpen={setOpen} />
    </Fragment>
  )
}
