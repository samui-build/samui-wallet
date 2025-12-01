import type { Wallet } from '@workspace/db/wallet/wallet'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link, useLocation } from 'react-router'
import { SettingsUiExportWalletMnemonic } from './settings-ui-export-wallet-mnemonic.tsx'
import { SettingsUiWalletItem } from './settings-ui-wallet-item.tsx'

export function SettingsUiWalletListItem({
  activeId,
  deleteItem,
  item,
}: {
  activeId: null | string
  deleteItem: (item: Wallet) => Promise<void>
  item: Wallet
}) {
  const { pathname: from } = useLocation()
  const { t } = useTranslation('settings')
  return (
    <Item key={item.id} role="listitem" variant={activeId === item.id ? 'muted' : 'outline'}>
      <ItemContent className="min-w-0">
        <ItemTitle>
          <Link to={`./${item.id}`}>
            <SettingsUiWalletItem item={item} />
          </Link>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <SettingsUiExportWalletMnemonic wallet={item} />
        <Button asChild size="icon" title={t(($) => $.actionEdit)} variant="outline">
          <Link state={{ from }} to={`./${item.id}/edit`}>
            <UiIcon className="size-4" icon="edit" />
          </Link>
        </Button>
        <UiConfirm
          action={async () => await deleteItem(item)}
          actionLabel="Delete"
          actionVariant="destructive"
          description="This action cannot be reversed."
          title="Are you sure you want to delete this wallet?"
        >
          <Button size="icon" title={t(($) => $.actionDelete)} variant="outline">
            <UiIcon className="size-4 text-red-500" icon="delete" />
          </Button>
        </UiConfirm>
      </ItemActions>
    </Item>
  )
}
