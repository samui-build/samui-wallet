import type { Address } from '@solana/kit'

import { getAddressFromPublicKey } from '@solana/kit'

import { convertKeyPairToJson } from './convert-key-pair-to-json.ts'

export interface PublicKeySecretKey {
  publicKey: Address
  secretKey: string
}

export async function convertKeyPairToPublicKeySecretKey(keyPair: CryptoKeyPair): Promise<PublicKeySecretKey> {
  const publicKey = await getAddressFromPublicKey(keyPair.publicKey)
  const secretKey = await convertKeyPairToJson(keyPair)

  return { publicKey, secretKey }
}
