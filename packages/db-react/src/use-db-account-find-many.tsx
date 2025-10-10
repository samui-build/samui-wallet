import type { DbAccountFindManyInput } from '@workspace/db/db-account-find-many'

import { useQuery } from '@tanstack/react-query'

import { dbAccountOptions } from './db-account-options'

export function useDbAccountFindMany({ input }: { input: DbAccountFindManyInput }) {
  return useQuery(dbAccountOptions.findMany(input))
}
