import { useMutation } from '@tanstack/react-query'
import { type AccountReadSecretKeyMutateOptions, optionsAccount } from './options-account.tsx'

export function useAccountReadSecretKey(props: AccountReadSecretKeyMutateOptions = {}) {
  return useMutation(optionsAccount.readSecretKey(props))
}
