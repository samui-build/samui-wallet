import type { Account } from '@workspace/db/account/account'
import type { Wallet } from '@workspace/db/wallet/wallet'

import { ItemGroup } from '@workspace/ui/components/item'
import { SettingsUiWalletListItem } from './settings-ui-wallet-list-item.tsx'

export function SettingsUiWalletList({
  activeId,
  deleteItem,
  items,
  onMoveDown,
  onMoveUp,
}: {
  activeId: null | string
  deleteItem: (item: Wallet) => Promise<void>
  items: Array<{ accounts?: Account[] } & Wallet>
  onMoveDown: (item: Wallet) => Promise<void>
  onMoveUp: (item: Wallet) => Promise<void>
}) {
  return (
    <ItemGroup className="gap-2 md:gap-4">
      {items.map((item, index) => (
        <SettingsUiWalletListItem
          activeId={activeId}
          deleteItem={deleteItem}
          isFirst={index === 0}
          isLast={index === items.length - 1}
          key={item.id}
          onMoveDown={onMoveDown}
          onMoveUp={onMoveUp}
          wallet={item}
        />
      ))}
    </ItemGroup>
  )
}
