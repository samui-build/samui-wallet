import type { Account } from '@workspace/db/account/account'
import { Badge } from '@workspace/ui/components/badge'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { SettingsUiAccountItem } from './settings-ui-account-item.tsx'
import { SettingsUiAccountMenu } from './settings-ui-account-menu.tsx'

export function SettingsUiAccountListItem({
  activeId,
  deleteItem,
  item,
}: {
  activeId: null | string
  deleteItem: (item: Account) => Promise<void>
  item: Account
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
        <SettingsUiAccountMenu account={item} deleteItem={deleteItem} />
      </ItemActions>
    </Item>
  )
}
