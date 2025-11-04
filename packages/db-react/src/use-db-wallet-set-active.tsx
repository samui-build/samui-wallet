import { useMutation } from '@tanstack/react-query'
import type { DbWalletSetActiveMutateOptions } from './db-wallet-options.tsx'
import { dbWalletOptions } from './db-wallet-options.tsx'

export function useDbWalletSetActive(props: DbWalletSetActiveMutateOptions = {}) {
  return useMutation(dbWalletOptions.setActive(props))
}
