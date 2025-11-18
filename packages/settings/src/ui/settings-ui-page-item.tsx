import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'
import type { SettingsPage } from '../data-access/settings-page.ts'

export function SettingsUiPageItem({ page }: { page: SettingsPage }) {
  return (
    <Item asChild key={page.id} size="sm" variant="outline">
      <Link to={`/settings/${page.id}`}>
        <ItemMedia>
          <UiIcon className="size-8" icon={page.icon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-xl">{page.name}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <UiIcon className="size-4" icon="chevronRight" />
        </ItemActions>
      </Link>
    </Item>
  )
}
