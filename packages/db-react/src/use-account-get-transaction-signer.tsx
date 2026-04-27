import type { Account } from '@workspace/db/account/account'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import type { GetTransactionSigner } from '@workspace/solana-client/transaction-signer'
import { useAccountSecretKey } from './use-account-secret-key.tsx'

export function useAccountGetTransactionSigner({ account }: { account: Account }): GetTransactionSigner {
  const accountSecretKey = useAccountSecretKey()

  return async () => {
    const secretKey = await accountSecretKey({ account })

    return await createKeyPairSignerFromJson({ json: secretKey })
  }
}
