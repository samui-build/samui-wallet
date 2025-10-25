import type { AccountInputFindMany } from '@workspace/db/dto/account-input-find-many'

import { useQuery } from '@tanstack/react-query'

import { dbAccountOptions } from './db-account-options'

export function useDbAccountFindManyWithWallets({ input }: { input: AccountInputFindMany }) {
  return useQuery(dbAccountOptions.findManyWithWallets(input))
}
