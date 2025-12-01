import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'
import { SettingsUiNetworkItem } from './settings-ui-network-item.tsx'

export function SettingsUiNetworkListItem({
  activeId,
  deleteItem,
  item,
}: {
  activeId: null | string
  deleteItem: (item: Network) => Promise<void>
  item: Network
}) {
  const { t } = useTranslation('settings')
  return (
    <Item
      className="flex-row items-center items-stretch"
      key={item.id}
      role="listitem"
      variant={activeId === item.id ? 'muted' : 'outline'}
    >
      <ItemContent className="flex justify-center">
        <ItemTitle>
          <Link to={`./${item.id}`}>
            <SettingsUiNetworkItem item={item} />
          </Link>
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
  )
}
