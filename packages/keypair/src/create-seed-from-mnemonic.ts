import * as bip39 from '@scure/bip39'
import { Effect } from 'effect'

import { validateMnemonic } from './validate-mnemonic.ts'

export async function createSeedFromMnemonic({
  mnemonic,
  passphrase,
}: {
  mnemonic: string
  passphrase?: string | undefined
}): Promise<Uint8Array> {
  validateMnemonic({ mnemonic })

  const result = Effect.tryPromise({
    catch: () => new Error('Error creating seed from mnemonic'),
    try: () => bip39.mnemonicToSeed(mnemonic, passphrase),
  })
  const data = await Effect.runPromise(result)
  return data
}
