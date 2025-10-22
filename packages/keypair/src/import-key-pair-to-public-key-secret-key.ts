import type { PublicKeySecretKey } from './convert-key-pair-to-public-key-secret-key'

import { convertKeyPairToPublicKeySecretKey } from './convert-key-pair-to-public-key-secret-key'
import { importKeyPair } from './import-key-pair'

export async function importKeyPairToPublicKeySecretKey(
  input: string,
  extractable = false,
): Promise<PublicKeySecretKey> {
  return convertKeyPairToPublicKeySecretKey(await importKeyPair(input, extractable))
}
