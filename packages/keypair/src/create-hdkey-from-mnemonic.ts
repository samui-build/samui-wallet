import { HDKey } from 'micro-key-producer/slip10.js'

import { createSeedFromMnemonic } from './create-seed-from-mnemonic.ts'

export async function createHDKeyFromMnemonic({
  mnemonic,
  passphrase,
}: {
  mnemonic: string
  passphrase?: string
}): Promise<HDKey> {
  const seed = await createSeedFromMnemonic({ mnemonic, passphrase })

  return HDKey.fromMasterSeed(seed)
}
