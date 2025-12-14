import type { Wallet } from '@workspace/db/wallet/wallet'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { Link } from 'react-router'
import { SettingsUiWalletItem } from './settings-ui-wallet-item.tsx'
import { SettingsUiWalletMenu } from './settings-ui-wallet-menu.tsx'

export function SettingsUiWalletListItem({
  activeId,
  deleteItem,
  item,
}: {
  activeId: null | string
  deleteItem: (item: Wallet) => Promise<void>
  item: Wallet
}) {
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
        <SettingsUiWalletMenu deleteItem={deleteItem} wallet={item} />
      </ItemActions>
    </Item>
  )
}
