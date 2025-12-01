import type { Network } from '@workspace/db/network/network'

import { UiAvatar } from '@workspace/ui/components/ui-avatar'

export function SettingsUiNetworkItem({ item }: { item: Network }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <UiAvatar label={item.name} />
      {item.name}
    </div>
  )
}
