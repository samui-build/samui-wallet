import * as bip39 from '@scure/bip39'

import { getMnemonicWordlist } from './get-mnemonic-wordlist'

export function generateMnemonic({ strength = 128 }: { strength?: 128 | 256 } = {}): string {
  if (![128, 256].includes(strength)) {
    throw new Error('strength must be 128 or 256')
  }
  const wordlist = getMnemonicWordlist()

  return bip39.generateMnemonic(wordlist, strength)
}
