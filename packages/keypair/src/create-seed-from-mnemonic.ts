import * as bip39 from '@scure/bip39'
import { Result } from '@workspace/core/result'

import { validateMnemonic } from './validate-mnemonic.ts'

export async function createSeedFromMnemonic({
  mnemonic,
  passphrase,
}: {
  mnemonic: string
  passphrase?: string | undefined
}): Promise<Uint8Array> {
  validateMnemonic({ mnemonic })

  const result = await Result.tryPromise(() => bip39.mnemonicToSeed(mnemonic, passphrase))

  if (Result.isError(result)) {
    throw new Error('Error creating seed from mnemonic')
  }
  return result.value
}
