import * as bip39 from '@scure/bip39'

export async function createSeedFromMnemonic({
  mnemonic,
  passphrase,
}: {
  mnemonic: string
  passphrase?: string
}): Promise<Uint8Array> {
  try {
    return await bip39.mnemonicToSeed(mnemonic, passphrase)
  } catch {
    throw new Error('Error creating seed from mnemonic')
  }
}
