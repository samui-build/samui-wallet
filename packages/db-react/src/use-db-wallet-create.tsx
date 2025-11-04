import { useMutation } from '@tanstack/react-query'
import type { DbWalletCreateMutateOptions } from './db-wallet-options.tsx'
import { dbWalletOptions } from './db-wallet-options.tsx'

export function useDbWalletCreate(props: DbWalletCreateMutateOptions = {}) {
  return useMutation(dbWalletOptions.create(props))
}
