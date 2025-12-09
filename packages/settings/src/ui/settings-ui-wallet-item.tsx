import type { Wallet } from '@workspace/db/wallet/wallet'

import { UiAvatar } from '@workspace/ui/components/ui-avatar'

export function SettingsUiWalletItem({ item }: { item: Wallet }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <UiAvatar color={item.color} label={item.name} />
      <div className="flex flex-col">
        <div>{item.name}</div>
        <div className="max-w-[150px] truncate text-muted-foreground text-xs md:max-w-[250px]">{item.description}</div>
      </div>
    </div>
  )
}
