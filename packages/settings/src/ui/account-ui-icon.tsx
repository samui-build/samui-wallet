import type { AccountType } from '@workspace/db/entity/account-type'
import type { UiIconLucide } from '@workspace/ui/components/ui-icon'

import { UiIcon } from '@workspace/ui/components/ui-icon'
import { LucideEye, LucideImport, LucideLetterText } from 'lucide-react'

export function AccountUiIcon({ type }: { type: AccountType }) {
  return <UiIcon className="size-4" icon={getAccountUiIcon(type)} />
}
function getAccountUiIcon(type: AccountType): UiIconLucide {
  switch (type) {
    case 'Derived':
      return LucideLetterText
    case 'Imported':
      return LucideImport
    case 'Watched':
      return LucideEye
  }
}
