import { useMutation } from '@tanstack/react-query'
import { type AccountReadSecretKeyMutateOptions, optionsAccount } from './options-account.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useAccountReadSecretKey(props: AccountReadSecretKeyMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.readSecretKey(ctx, props))
}
