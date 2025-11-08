import type { Wallet } from '@workspace/db/entity/wallet'

import { UiAvatar } from '@workspace/ui/components/ui-avatar'

export function SettingsUiWalletItem({ item }: { item: Wallet }) {
  return (
    <div className="flex items-center gap-2">
      <UiAvatar label={item.name} />
      {item.name}
    </div>
  )
}
