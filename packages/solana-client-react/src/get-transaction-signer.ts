import { tryCatch } from '@workspace/core/try-catch'
import type { Account } from '@workspace/db/account/account'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'

export async function getTransactionSigner(
  account: Account,
  readSecretKey: (input: { id: string }) => Promise<string | undefined>,
) {
  const { data, error } = await tryCatch(
    Promise.resolve().then(async () => {
      const secretKey = await readSecretKey({ id: account.id })
      if (!secretKey) {
        throw new Error('Missing account secret key')
      }
      return createKeyPairSignerFromJson({ json: secretKey })
    }),
  )
  if (error) {
    throw error
  }
  return data
}
