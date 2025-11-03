import { useQuery } from '@tanstack/react-query'
import type { AccountInputFindMany } from '@workspace/db/dto/account-input-find-many'

import { dbAccountOptions } from './db-account-options.tsx'

export function useDbAccountFindMany({ input }: { input: AccountInputFindMany }) {
  return useQuery(dbAccountOptions.findMany(input))
}
