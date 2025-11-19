import { useQuery } from '@tanstack/react-query'
import type { AccountFindManyInput } from '@workspace/db/account/account-find-many-input'

import { dbAccountOptions } from './db-account-options.tsx'

export function useDbAccountFindMany({ input }: { input: AccountFindManyInput }) {
  return useQuery(dbAccountOptions.findMany(input))
}
