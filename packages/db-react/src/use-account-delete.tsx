import { useMutation } from '@tanstack/react-query'
import type { AccountDeleteMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountDelete(props: AccountDeleteMutateOptions = {}) {
  return useMutation(optionsAccount.delete(props))
}
