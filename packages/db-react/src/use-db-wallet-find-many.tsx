import type { DbWalletFindManyInput } from '@workspace/db/db-wallet-find-many'

import { useQuery } from '@tanstack/react-query'

import { dbWalletOptions } from './db-wallet-options'

export function useDbWalletFindMany({ input }: { input: DbWalletFindManyInput }) {
  return useQuery(dbWalletOptions.findMany(input))
}
