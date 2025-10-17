import type { KeyPairSigner } from '@solana/kit'

import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit'

import { createSeedFromMnemonic } from './create-seed-from-mnemonic'

export async function createKeyPairSignerFromBip39({
  extractable = false,
  mnemonic,
  passphrase = '',
}: {
  extractable?: boolean
  mnemonic: string
  passphrase?: string
}): Promise<KeyPairSigner> {
  const seed = await createSeedFromMnemonic({ mnemonic, passphrase })

  const privateKeyBytes = seed.subarray(0, 32)

  // TODO: Address Happy Path blindness
  return await createKeyPairSignerFromPrivateKeyBytes(new Uint8Array(privateKeyBytes), extractable)
}
