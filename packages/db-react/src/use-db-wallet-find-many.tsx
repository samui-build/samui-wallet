import { useQuery } from '@tanstack/react-query'
import type { WalletFindManyInput } from '@workspace/db/wallet/wallet-find-many-input'

import { dbWalletOptions } from './db-wallet-options.tsx'

export function useDbWalletFindMany({ input }: { input: WalletFindManyInput }) {
  return useQuery(dbWalletOptions.findMany(input))
}
