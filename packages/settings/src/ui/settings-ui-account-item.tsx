import type { Account } from '@workspace/db/entity/account'

import { UiAvatar } from '@workspace/ui/components/ui-avatar'

export function SettingsUiAccountItem({ item }: { item: Account }) {
  return (
    <div className="flex items-center gap-2">
      <UiAvatar label={item.name} />
      {item.name}
    </div>
  )
}
