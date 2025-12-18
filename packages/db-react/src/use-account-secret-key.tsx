import type { Account } from '@workspace/db/account/account'
import { useAccountReadSecretKey } from './use-account-read-secret-key.tsx'

export function useAccountSecretKey() {
  const readSecretKeyMutation = useAccountReadSecretKey()
  return async ({ account }: { account: Account }) => {
    const secretKey = await readSecretKeyMutation.mutateAsync({ id: account.id })

    if (!secretKey) {
      throw new Error(`No secret key for this account`)
    }

    return secretKey
  }
}
