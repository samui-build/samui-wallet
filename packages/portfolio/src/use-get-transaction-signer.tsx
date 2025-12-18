import type { Account } from '@workspace/db/account/account'
import { useAccountSecretKey } from '@workspace/db-react/use-account-secret-key'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'

export function useGetTransactionSigner({ account }: { account: Account }) {
  const accountSecretKey = useAccountSecretKey()

  return async () => {
    const secretKey = await accountSecretKey({ account })

    return await createKeyPairSignerFromJson({ json: secretKey })
  }
}
