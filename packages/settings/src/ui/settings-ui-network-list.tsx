import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from '@workspace/ui/components/item'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { Link } from 'react-router'

export function SettingsUiNetworkList({
  activeId,
  deleteItem,
  items,
}: {
  activeId: null | string
  deleteItem: (item: Network) => Promise<void>
  items: Network[]
}) {
  const { t } = useTranslation('settings')
  return (
    <ItemGroup className="gap-2 md:gap-4">
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
            <UiTooltip content={t(($) => $.actionEdit)}>
              <Button asChild size="icon" variant="outline">
                <Link to={`./${item.id}`}>
                  <UiIcon className="size-4" icon="edit" />
                </Link>
              </Button>
            </UiTooltip>
            <UiTooltip content={t(($) => $.actionDelete)}>
              <UiConfirm
                action={async () => await deleteItem(item)}
                actionLabel="Delete"
                actionVariant="destructive"
                description="This action can not be reversed."
                title="Are you sure you want to delete this network?"
              >
                <Button size="icon" variant="outline">
                  <UiIcon className="text-red-500 size-4" icon="delete" />
                </Button>
              </UiConfirm>
            </UiTooltip>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
