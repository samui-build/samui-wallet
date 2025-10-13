import * as bip39 from '@scure/bip39'
import { tryCatch } from '@workspace/core/try-catch'

export async function createSeedFromMnemonic({
  mnemonic,
  passphrase,
}: {
  mnemonic: string
  passphrase?: string
}): Promise<Uint8Array> {
  const { data, error } = await tryCatch(bip39.mnemonicToSeed(mnemonic, passphrase))
  if (error) {
    throw new Error('Error creating seed from mnemonic')
  }
  return data
}
