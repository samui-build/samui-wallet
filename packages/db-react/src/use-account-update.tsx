import { useMutation } from '@tanstack/react-query'
import type { AccountUpdateMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountUpdate(props: AccountUpdateMutateOptions = {}) {
  return useMutation(optionsAccount.update(props))
}
