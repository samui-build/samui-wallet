import type { Wallet } from '@workspace/db/wallet/wallet'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Fragment, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { SettingsUiExportWalletMnemonicSheet } from './settings-ui-export-wallet-mnemonic-sheet.tsx'

export function SettingsUiWalletMenu({
  deleteItem,
  wallet,
}: {
  deleteItem: (item: Wallet) => Promise<void>
  wallet: Wallet
}) {
  const { t } = useTranslation('settings')
  const { pathname: from } = useLocation()
  const [openDelete, setOpenDelete] = useState(false)
  const [openExport, setOpenExport] = useState(false)
  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <UiIcon icon="menu" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link state={{ from }} to={`/settings/wallets/${wallet.id}/edit`}>
              {t(($) => $.actionEditWallet)}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenExport(true)}>
            {t(($) => $.exportMnemonic)}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDelete(true)}>
            {t(($) => $.actionDeleteWallet)}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsUiExportWalletMnemonicSheet open={openExport} setOpen={setOpenExport} wallet={wallet} />
      <UiConfirm
        action={async () => await deleteItem(wallet)}
        actionLabel={t(($) => $.actionDelete)}
        actionVariant="destructive"
        description={t(($) => $.walletDeleteDescription)}
        onOpenChange={setOpenDelete}
        open={openDelete}
        title={t(($) => $.walletDeleteTitle)}
      />
    </Fragment>
  )
}
