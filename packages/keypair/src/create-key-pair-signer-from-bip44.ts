import type { KeyPairSigner } from '@solana/kit'

import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit'

import { createHDKeyFromMnemonic } from './create-hdkey-from-mnemonic'
import { derivationPaths } from './derivation-paths'

export async function createKeyPairSignerFromBip44({
  derivationPath = derivationPaths.default,
  extractable = false,
  // TODO: We may want to consider alternatives for the 'from' and 'to' properties.
  from = 0,
  mnemonic,
  passphrase = '',
  to = 10,
}: {
  derivationPath?: string
  extractable?: boolean
  from?: number
  mnemonic: string
  passphrase?: string
  to?: number
}): Promise<KeyPairSigner[]> {
  if (to <= 0) {
    throw new Error('to must be a positive number')
  }
  if (from < 0) {
    throw new Error('from must be a positive number')
  }
  if (to <= from) {
    throw new Error('to must be greater than from')
  }
  // TODO: We may want to set a maximum range to derive?
  const results: KeyPairSigner[] = []
  const hd = await createHDKeyFromMnemonic({ mnemonic, passphrase })

  for (let i = from; i < to; i++) {
    const path = derivationPath.replace('i', i.toString())
    const privateKeyBytes = hd.derive(path).privateKey

    // TODO: Address Happy Path blindness
    results.push(await createKeyPairSignerFromPrivateKeyBytes(new Uint8Array(privateKeyBytes), extractable))
  }
  return results
}
