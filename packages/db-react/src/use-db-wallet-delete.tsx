import { useMutation } from '@tanstack/react-query'
import type { DbWalletDeleteMutateOptions } from './db-wallet-options.tsx'
import { dbWalletOptions } from './db-wallet-options.tsx'

export function useDbWalletDelete(props: DbWalletDeleteMutateOptions = {}) {
  return useMutation(dbWalletOptions.delete(props))
}
