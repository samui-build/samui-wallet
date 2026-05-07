import { useMutation } from '@tanstack/react-query'
import type { AccountDeleteMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useAccountDelete(props: AccountDeleteMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.delete(ctx, props))
}
