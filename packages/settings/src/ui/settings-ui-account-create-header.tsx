import type { UiIconLucide } from '@workspace/ui/components/ui-icon'

import { Item, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiIcon } from '@workspace/ui/components/ui-icon'

export function SettingsUiAccountCreateHeader({ icon, label }: { icon: UiIconLucide; label: string }) {
  return (
    <Item size="sm" variant="default">
      <ItemMedia>
        <UiIcon className="size-5" icon={icon} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{label}</ItemTitle>
      </ItemContent>
    </Item>
  )
}
