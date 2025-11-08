import type { Wallet } from '@workspace/db/entity/wallet'

import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucidePencil, LucideTrash } from 'lucide-react'
import { Link } from 'react-router'

import { SettingsUiWalletItem } from './settings-ui-wallet-item.tsx'

export function SettingsUiWalletListItem({
  active,
  deleteItem,
  item,
}: {
  active: Wallet | null
  deleteItem: (item: Wallet) => Promise<void>
  item: Wallet
}) {
  return (
    <Item key={item.id} role="listitem" variant={active?.id === item.id ? 'muted' : 'outline'}>
      <ItemContent>
        <ItemTitle className="line-clamp-1">
          <Link to={`./${item.id}`}>
            <SettingsUiWalletItem item={item} />
          </Link>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <UiTooltip content="Edit wallet">
          <Button asChild size="icon" variant="outline">
            <Link to={`./${item.id}/edit`}>
              <LucidePencil className="size-4" />
            </Link>
          </Button>
        </UiTooltip>
        <UiTooltip content="Delete wallet">
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
