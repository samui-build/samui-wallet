import type { PublicKeySecretKey } from './convert-key-pair-to-public-key-secret-key.ts'
import { convertKeyPairToPublicKeySecretKey } from './convert-key-pair-to-public-key-secret-key.ts'
import { importKeyPair } from './import-key-pair.ts'

export async function importKeyPairToPublicKeySecretKey(
  input: string,
  extractable = false,
): Promise<PublicKeySecretKey> {
  return convertKeyPairToPublicKeySecretKey(await importKeyPair(input, extractable))
}
