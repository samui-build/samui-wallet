import { useMutation } from '@tanstack/react-query'
import type { AccountCreateMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useAccountCreate(props: AccountCreateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.create(ctx, props))
}
