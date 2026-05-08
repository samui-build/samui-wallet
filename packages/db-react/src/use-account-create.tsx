import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { AccountCreateMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountCreate(props: AccountCreateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.create(ctx, props))
}
