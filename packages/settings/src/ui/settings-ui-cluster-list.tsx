import type { Cluster } from '@workspace/db/entity/cluster'

import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@workspace/ui/components/item'
import { LucidePencil, LucideTrash } from 'lucide-react'
import { Link } from 'react-router'

export function SettingsUiClusterList({
  deleteItem,
  items,
}: {
  deleteItem: (item: Cluster) => Promise<void>
  items: Cluster[]
}) {
  return (
    <ItemGroup className="gap-4">
      {items.map((item) => (
        <Item key={item.id} role="listitem" variant="outline">
          <ItemContent>
            <ItemTitle className="line-clamp-1">
              <Link to={`./${item.id}`}>{item.name}</Link>
            </ItemTitle>
            <ItemDescription>{item.endpoint}</ItemDescription>
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
      ))}
    </ItemGroup>
  )
}
