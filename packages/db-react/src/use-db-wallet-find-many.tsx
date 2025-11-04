import { useQuery } from '@tanstack/react-query'
import type { WalletInputFindMany } from '@workspace/db/dto/wallet-input-find-many'

import { dbWalletOptions } from './db-wallet-options.tsx'

export function useDbWalletFindMany({ input }: { input: WalletInputFindMany }) {
  return useQuery(dbWalletOptions.findMany(input))
}
