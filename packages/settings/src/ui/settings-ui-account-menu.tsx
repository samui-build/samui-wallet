import type { Account } from '@workspace/db/account/account'
import type { NetworkType } from '@workspace/db/network/network-type'
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
import { SettingsUiBottomSheetExportAccountSecretKey } from './settings-ui-bottom-sheet-export-account-secret-key.tsx'

export interface SettingsUiAccountMenuProps {
  account: Account
  deleteItem: (item: Account) => Promise<void>
  isFirst?: boolean
  isLast?: boolean
  networkType: NetworkType
  onMoveDown?: (item: Account) => Promise<void>
  onMoveUp?: (item: Account) => Promise<void>
  requestAirdrop: (item: Account) => Promise<void>
}

export function SettingsUiAccountMenu({
  account,
  deleteItem,
  isFirst,
  isLast,
  networkType,
  onMoveDown,
  onMoveUp,
  requestAirdrop,
}: SettingsUiAccountMenuProps) {
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
            <Link state={{ from }} to={`/explorer/address/${account.publicKey}`}>
              {t(($) => $.actionViewAccount)}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isFirst || !onMoveUp}
            onClick={() => onMoveUp?.(account)}
          >
            {t(($) => $.actionMoveAccountUp)}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isLast || !onMoveDown}
            onClick={() => onMoveDown?.(account)}
          >
            {t(($) => $.actionMoveAccountDown)}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={networkType === 'solana:mainnet'}
            onClick={() => requestAirdrop(account)}
          >
            {t(($) => $.actionRequestAirdrop)}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenExport(true)}>
            {t(($) => $.exportSecretKey)}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDelete(true)}>
            {t(($) => $.actionDeleteAccount)}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsUiBottomSheetExportAccountSecretKey account={account} open={openExport} setOpen={setOpenExport} />
      <UiConfirm
        action={() => deleteItem(account)}
        actionLabel={t(($) => $.actionDelete)}
        actionVariant="destructive"
        description={t(($) => $.accountDeleteDescription)}
        onOpenChange={setOpenDelete}
        open={openDelete}
        title={t(($) => $.accountDeleteTitle)}
      />
    </Fragment>
  )
}
