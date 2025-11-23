import { useMutation } from '@tanstack/react-query'
import type { AccountCreateMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountCreate(props: AccountCreateMutateOptions = {}) {
  return useMutation(optionsAccount.create(props))
}
