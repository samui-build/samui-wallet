import type { KeyPairSigner } from '@solana/kit'

import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit'

import { convertJsonToByteArray } from './convert-json-to-byte-array'

export async function createKeyPairSignerFromJson({
  extractable = false,
  json,
}: {
  extractable?: boolean
  json: string
}): Promise<KeyPairSigner> {
  const byteArray = convertJsonToByteArray(json)
  if (byteArray.length !== 64) {
    throw new Error('Invalid JSON: expected a 64-byte array')
  }
  const privateKeyBytes = byteArray.slice(0, 32)

  return await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes, extractable)
}
