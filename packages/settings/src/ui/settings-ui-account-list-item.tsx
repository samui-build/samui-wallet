import type { Account } from '@workspace/db/entity/account'

import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucideCheck, LucidePencil, LucideTrash } from 'lucide-react'
import { Link } from 'react-router'

import { SettingsUiAccountItem } from './settings-ui-account-item.js'

export function SettingsUiAccountListItem({
  activeId,
  deleteItem,
  item,
  setActive,
}: {
  activeId: null | string
  deleteItem: (item: Account) => Promise<void>
  item: Account
  setActive: (id: string) => Promise<void>
}) {
  return (
    <Item key={item.id} role="listitem" variant={activeId === item.id ? 'muted' : 'outline'}>
      <ItemContent>
        <ItemTitle className="line-clamp-1">
          <Link to={`./${item.id}`}>
            <SettingsUiAccountItem item={item} />
          </Link>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        {activeId === item.id ? null : (
          <UiTooltip content="Set as active">
            <Button
              onClick={async () => {
                await setActive(item.id)
              }}
              size="icon"
              variant="outline"
            >
              <LucideCheck className="text-green-500 size-4" />
            </Button>
          </UiTooltip>
        )}
        <UiTooltip content="Edit">
          <Button asChild size="icon" variant="outline">
            <Link to={`./${item.id}`}>
              <LucidePencil className="size-4" />
            </Link>
          </Button>
        </UiTooltip>
        <UiTooltip content="Delete">
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
