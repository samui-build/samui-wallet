import type { Account } from '@workspace/db/account/account'
import type { NetworkType } from '@workspace/db/network/network-type'
import { Badge } from '@workspace/ui/components/badge'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { SettingsUiAccountItem } from './settings-ui-account-item.tsx'
import { SettingsUiAccountMenu } from './settings-ui-account-menu.tsx'

export function SettingsUiAccountListItem({
  activeId,
  deleteItem,
  networkType,
  requestAirdrop,
  item,
}: {
  activeId: null | string
  deleteItem: (item: Account) => Promise<void>
  item: Account
  networkType: NetworkType
  requestAirdrop: (item: Account) => Promise<void>
}) {
  return (
    <Item key={item.id} role="listitem" variant={activeId === item.id ? 'muted' : 'outline'}>
      <ItemContent className="min-w-0">
        <ItemTitle>
          <SettingsUiAccountItem item={item} />
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Badge variant="outline">{item.type}</Badge>
        <SettingsUiAccountMenu
          account={item}
          deleteItem={deleteItem}
          networkType={networkType}
          requestAirdrop={requestAirdrop}
        />
      </ItemActions>
    </Item>
  )
}
