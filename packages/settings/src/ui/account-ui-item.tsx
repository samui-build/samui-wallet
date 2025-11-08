import type { Account } from '@workspace/db/entity/account'

import { AccountUiIcon } from './account-ui-icon.tsx'

export function AccountUiItem({ account }: { account: Account }) {
  return (
    <span className="flex items-center gap-2">
      <AccountUiIcon type={account.type} />
      <span className="font-mono">{account.name}</span>
    </span>
  )
}
