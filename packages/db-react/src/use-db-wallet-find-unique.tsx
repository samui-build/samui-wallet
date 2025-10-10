import { useQuery } from '@tanstack/react-query'

import { dbWalletOptions } from './db-wallet-options'

export function useDbWalletFindUnique({ id }: { id: string }) {
  return useQuery(dbWalletOptions.findUnique(id))
}
