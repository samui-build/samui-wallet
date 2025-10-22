import { createKeyPairFromBytes, getBase58Encoder } from '@solana/kit'

export async function createKeyPairFromBase58(input: string, extractable = false): Promise<CryptoKeyPair> {
  return createKeyPairFromBytes(getBase58Encoder().encode(input), extractable)
}
