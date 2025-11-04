import * as bip39 from '@scure/bip39'
import { tryCatch } from '@workspace/core/try-catch'

import { validateMnemonic } from './validate-mnemonic.ts'

export async function createSeedFromMnemonic({
  mnemonic,
  passphrase,
}: {
  mnemonic: string
  passphrase?: string | undefined
}): Promise<Uint8Array> {
  validateMnemonic({ mnemonic })

  const { data, error } = await tryCatch(bip39.mnemonicToSeed(mnemonic, passphrase))

  if (error) {
    throw new Error('Error creating seed from mnemonic')
  }
  return data
}
