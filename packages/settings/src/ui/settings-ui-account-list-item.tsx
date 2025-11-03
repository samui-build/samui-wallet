import type { Account } from '@workspace/db/entity/account'

import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucidePencil, LucideTrash } from 'lucide-react'
import { Link } from 'react-router'

import { SettingsUiAccountItem } from './settings-ui-account-item.tsx'

export function SettingsUiAccountListItem({
  active,
  deleteItem,
  item,
}: {
  active: Account | null
  deleteItem: (item: Account) => Promise<void>
  item: Account
}) {
  return (
    <Item key={item.id} role="listitem" variant={active?.id === item.id ? 'muted' : 'outline'}>
      <ItemContent>
        <ItemTitle className="line-clamp-1">
          <Link to={`./${item.id}`}>
            <SettingsUiAccountItem item={item} />
          </Link>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <UiTooltip content="Edit account">
          <Button asChild size="icon" variant="outline">
            <Link to={`./${item.id}/edit`}>
              <LucidePencil className="size-4" />
            </Link>
          </Button>
        </UiTooltip>
        <UiTooltip content="Delete account">
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
        </UiTooltip>
      </ItemActions>
    </Item>
  )
}
