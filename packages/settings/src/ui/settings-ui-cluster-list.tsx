import type { Cluster } from '@workspace/db/entity/cluster'

import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@workspace/ui/components/item'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucideCheck, LucidePencil, LucideTrash } from 'lucide-react'
import { Link } from 'react-router'

export function SettingsUiClusterList({
  activeId,
  deleteItem,
  items,
  setActive,
}: {
  activeId: null | string
  deleteItem: (item: Cluster) => Promise<void>
  items: Cluster[]
  setActive: (id: string) => Promise<void>
}) {
  return (
    <ItemGroup className="gap-4">
      {items.map((item) => (
        <Item
          className="flex-col items-stretch sm:flex-row sm:items-center"
          key={item.id}
          role="listitem"
          variant={activeId === item.id ? 'muted' : 'outline'}
        >
          <ItemContent>
            <ItemTitle className="line-clamp-1">
              <Link to={`./${item.id}`}>{item.name}</Link>
            </ItemTitle>
            <ItemDescription>{item.endpoint}</ItemDescription>
          </ItemContent>
          <ItemActions className="w-full sm:w-auto">
            {activeId == item.id ? null : (
              <UiTooltip content="Set as active">
                <Button onClick={() => setActive(item.id)} size="icon" variant="outline">
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
      ))}
    </ItemGroup>
  )
}
