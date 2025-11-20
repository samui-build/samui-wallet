import { useQuery } from '@tanstack/react-query'
import type { AccountFindManyInput } from '@workspace/db/account/account-find-many-input'

import { optionsAccount } from './options-account.tsx'

export function useAccountFindMany({ input }: { input: AccountFindManyInput }) {
  return useQuery(optionsAccount.findMany(input))
}
