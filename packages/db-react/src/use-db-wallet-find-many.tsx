import type { WalletInputFindMany } from '@workspace/db/dto/wallet-input-find-many'

import { useQuery } from '@tanstack/react-query'

import { dbWalletOptions } from './db-wallet-options'

export function useDbWalletFindMany({ input }: { input: WalletInputFindMany }) {
  return useQuery(dbWalletOptions.findMany(input))
}
