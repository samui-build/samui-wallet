import { createKeyPairSignerFromPrivateKeyBytes, KeyPairSigner } from '@solana/kit'

import { createHDKeyFromMnemonic } from './create-hdkey-from-mnemonic'

export async function createKeyPairSignerFromBip44({
  // TODO: We may want to consider alternatives for the 'from' and 'to' properties.
  from = 0,
  mnemonic,
  passphrase = '',
  derivationPath = `m/44'/501'/i'/0'`,
  to = 10,
}: {
  from?: number
  mnemonic: string
  passphrase?: string
  derivationPath?: string
  to?: number
}): Promise<KeyPairSigner[]> {
  // TODO: From should be at least 0, to should be at least from + 1. We may want to set a maximum range to derive?
  const results: KeyPairSigner[] = []
  const hd = await createHDKeyFromMnemonic({ mnemonic, passphrase })

  for (let i = from; i < to; i++) {
    const path = derivationPath.replace('i', i.toString())
    const privateKeyBytes = hd.derive(path).privateKey

    // TODO: Address Happy Path blindness
    results.push(await createKeyPairSignerFromPrivateKeyBytes(new Uint8Array(privateKeyBytes)))
  }
  return results
}
