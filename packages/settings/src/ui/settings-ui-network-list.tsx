import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from '@workspace/ui/components/item'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
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
          className="flex-row items-center items-stretch"
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
            <Button asChild size="icon" title={t(($) => $.actionEdit)} variant="outline">
              <Link to={`./${item.id}`}>
                <UiIcon className="size-4" icon="edit" />
              </Link>
            </Button>
            <UiConfirm
              action={async () => await deleteItem(item)}
              actionLabel="Delete"
              actionVariant="destructive"
              description="This action cannot be reversed."
              title="Are you sure you want to delete this network?"
            >
              <Button size="icon" title={t(($) => $.actionDelete)} variant="outline">
                <UiIcon className="size-4 text-red-500" icon="delete" />
              </Button>
            </UiConfirm>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
