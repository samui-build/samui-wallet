import { Item, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { UiIconName } from '@workspace/ui/components/ui-icon-map'

export function SettingsUiWalletCreateHeader({ icon, label }: { icon: UiIconName; label: string }) {
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
