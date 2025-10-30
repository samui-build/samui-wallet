import type { Cluster } from '@workspace/db/entity/cluster'

import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from '@workspace/ui/components/item'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucidePencil, LucideTrash } from 'lucide-react'
import { Link } from 'react-router'

export function SettingsUiClusterList({
  activeId,
  deleteItem,
  items,
}: {
  activeId: null | string
  deleteItem: (item: Cluster) => Promise<void>
  items: Cluster[]
}) {
  return (
    <ItemGroup className="gap-4">
      {items.map((item) => (
        <Item
          className="items-stretch flex-row items-center"
          key={item.id}
          role="listitem"
          variant={activeId === item.id ? 'muted' : 'outline'}
        >
          <ItemContent>
            <ItemTitle className="line-clamp-1">
              <Link to={`./${item.id}`}>{item.name}</Link>
            </ItemTitle>
          </ItemContent>
          <ItemActions>
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
      ))}
    </ItemGroup>
  )
}
