import type { AccountType } from '@workspace/db/account/account-type'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { UiIconName } from '@workspace/ui/components/ui-icon-map'

export function AccountUiIcon({ type }: { type: AccountType }) {
  return <UiIcon className="size-4" icon={getAccountUiIcon(type)} />
}
function getAccountUiIcon(type: AccountType): UiIconName {
  switch (type) {
    case 'Derived':
      return 'derive'
    case 'Imported':
      return 'import'
    case 'Watched':
      return 'watch'
  }
}
