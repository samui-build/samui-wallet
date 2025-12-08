import type { KeyPairSigner } from '@solana/kit'
import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useAccountReadSecretKey } from '@workspace/db-react/use-account-read-secret-key'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'

export function useActiveAccountSecretKey(): () => Promise<KeyPairSigner> {
  const account = useAccountActive()
  const readSecretKeyMutation = useAccountReadSecretKey()

  return async () => {
    const result = await readSecretKeyMutation.mutateAsync({ id: account.id })
    if (!result) {
      throw new Error(`No secret key for this account`)
    }
    return await createKeyPairSignerFromJson({ json: result })
  }
}
