import type { AccountType } from '@workspace/db/account/account-type'
import { useTranslation } from '@workspace/i18n'

export function AccountTypeLabel({ type }: { type: AccountType }) {
  const { t } = useTranslation('settings')
  switch (type) {
    case 'Derived':
      return t(($) => $.accountTypeDerived)
    case 'Imported':
      return t(($) => $.accountTypeImported)
    case 'Watched':
      return t(($) => $.accountTypeWatched)
    default:
      throw new Error('Unknown account type')
  }
}
