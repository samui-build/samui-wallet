import type { AccountInputFindMany } from '@workspace/db/dto/account-input-find-many'

import { useQuery } from '@tanstack/react-query'

import { dbAccountOptions } from './db-account-options'

export function useDbAccountFindMany({ input }: { input: AccountInputFindMany }) {
  return useQuery(dbAccountOptions.findMany(input))
}
