import type { Wallet } from '@workspace/db/wallet/wallet'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Fragment, useState } from 'react'

export function SettingsUiWalletDeleteConfirm({
  deleteItem,
  item,
}: {
  deleteItem: (item: Wallet) => Promise<void>
  item: Wallet
}) {
  const { t } = useTranslation('settings')
  const [open, setOpen] = useState(false)
  return (
    <Fragment>
      <Button onClick={() => setOpen((value) => !value)} size="icon" title={t(($) => $.actionDelete)} variant="outline">
        <UiIcon className="size-4 text-red-500" icon="delete" />
      </Button>
      <UiConfirm
        action={async () => await deleteItem(item)}
        actionLabel="Delete"
        actionVariant="destructive"
        description="This action cannot be reversed."
        onOpenChange={(value) => setOpen(value)}
        open={open}
        title="Are you sure you want to delete this wallet?"
      />
    </Fragment>
  )
}
