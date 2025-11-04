import { createKeyPairFromBytes } from '@solana/kit'

import { convertJsonToByteArray } from './convert-json-to-byte-array.ts'
import { createKeyPairFromBase58 } from './create-key-pair-from-base58.ts'

export async function importKeyPair(input: string, extractable = false): Promise<CryptoKeyPair> {
  try {
    return createKeyPairFromBytes(convertJsonToByteArray(input), extractable)
  } catch {
    return createKeyPairFromBase58(input, extractable)
  }
}
