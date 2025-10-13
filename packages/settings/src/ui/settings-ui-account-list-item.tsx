import type { Account } from '@workspace/db/entity/account'

import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { LucidePencil, LucideTrash } from 'lucide-react'
import { Link } from 'react-router'

import { SettingsUiAccountItem } from './settings-ui-account-item.js'

export function SettingsUiAccountListItem({
  deleteItem,
  item,
}: {
  deleteItem: (item: Account) => Promise<void>
  item: Account
}) {
  return (
    <Item key={item.id} role="listitem" variant="outline">
      <ItemContent>
        <ItemTitle className="line-clamp-1">
          <Link to={`./${item.id}`}>
            <SettingsUiAccountItem item={item} />
          </Link>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button asChild size="icon" variant="outline">
          <Link to={`./${item.id}`}>
            <LucidePencil className="size-4" />
          </Link>
        </Button>
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
          <LucideTrash className="text-red-500 size-4" />
        </Button>
      </ItemActions>
    </Item>
  )
}
