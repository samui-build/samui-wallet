import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { NavLink } from 'react-router'
import type { SettingsPage } from '../data-access/settings-page.ts'

export function SettingsUiPageItem({ page }: { page: SettingsPage }) {
  return (
    <NavLink to={`/settings/${page.id}`}>
      {({ isActive }) => (
        <Item size="sm" variant={isActive ? 'muted' : 'outline'}>
          <ItemMedia>
            <UiIcon icon={page.icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-xl">{page.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <UiIcon className="size-4" icon="chevronRight" />
          </ItemActions>
        </Item>
      )}
    </NavLink>
  )
}
