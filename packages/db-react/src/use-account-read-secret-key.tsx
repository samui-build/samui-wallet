import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import { type AccountReadSecretKeyMutateOptions, optionsAccount } from './options-account.tsx'

export function useAccountReadSecretKey(props: AccountReadSecretKeyMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.readSecretKey(ctx, props))
}
