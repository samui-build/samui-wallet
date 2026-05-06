import type { Account } from '@workspace/db/account/account'
import { Badge } from '@workspace/ui/components/badge'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { SettingsUiAccountItem } from './settings-ui-account-item.tsx'
import { SettingsUiAccountMenu, type SettingsUiAccountMenuProps } from './settings-ui-account-menu.tsx'

export function SettingsUiAccountListItem({
  activeId,
  item,
  ...props
}: Omit<SettingsUiAccountMenuProps, 'account'> & {
  activeId: null | string
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
        <SettingsUiAccountMenu {...props} account={item} />
      </ItemActions>
    </Item>
  )
}
