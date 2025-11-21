import type { Wallet } from '@workspace/db/wallet/wallet'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { Link } from 'react-router'
import { SettingsUiWalletExportMnemonicButton } from './settings-ui-wallet-export-mnemonic-button.tsx'
import { SettingsUiWalletItem } from './settings-ui-wallet-item.tsx'

export function SettingsUiWalletListItem({
  active,
  deleteItem,
  item,
}: {
  active: Wallet | null
  deleteItem: (item: Wallet) => Promise<void>
  item: Wallet
}) {
  const { t } = useTranslation('settings')
  return (
    <Item key={item.id} role="listitem" variant={active?.id === item.id ? 'muted' : 'outline'}>
      <ItemContent>
        <ItemTitle className="line-clamp-1">
          <Link to={`./${item.id}`}>
            <SettingsUiWalletItem item={item} />
          </Link>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <SettingsUiWalletExportMnemonicButton wallet={item} />
        <UiTooltip content={t(($) => $.actionEdit)}>
          <Button asChild size="icon" variant="outline">
            <Link to={`./${item.id}/edit`}>
              <UiIcon className="size-4" icon="edit" />
            </Link>
          </Button>
        </UiTooltip>
        <UiTooltip content={t(($) => $.actionDelete)}>
          <Button
            onClick={async (e) => {
              e.preventDefault()
              if (!window.confirm('Are you sure?')) {
                return
              }
              await deleteItem(item)
            }}
            size="icon"
            variant="outline"
          >
            <UiIcon className="text-red-500 size-4" icon="delete" />
          </Button>
        </UiTooltip>
      </ItemActions>
    </Item>
  )
}
