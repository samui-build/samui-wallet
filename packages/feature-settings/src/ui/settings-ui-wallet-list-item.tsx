import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { Link } from 'react-router'
import { SettingsUiWalletItem } from './settings-ui-wallet-item.tsx'
import { SettingsUiWalletMenu, type SettingsUiWalletMenuProps } from './settings-ui-wallet-menu.tsx'

export function SettingsUiWalletListItem({
  activeId,
  wallet,
  ...props
}: SettingsUiWalletMenuProps & { activeId: null | string }) {
  return (
    <Item key={wallet.id} role="listitem" variant={activeId === wallet.id ? 'muted' : 'outline'}>
      <ItemContent className="min-w-0">
        <ItemTitle>
          <Link to={`./${wallet.id}`}>
            <SettingsUiWalletItem item={wallet} />
          </Link>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <SettingsUiWalletMenu {...props} wallet={wallet} />
      </ItemActions>
    </Item>
  )
}
