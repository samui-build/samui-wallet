import * as bip39 from '@scure/bip39'

import { getMnemonicWordlist } from './get-mnemonic-wordlist'

export const MnemonicStrength = [128, 256] as const

export type MnemonicStrength = (typeof MnemonicStrength)[number]

export function generateMnemonic({ strength = 128 }: { strength?: MnemonicStrength } = {}): string {
  if (![128, 256].includes(strength)) {
    throw new Error('strength must be 128 or 256')
  }
  const wordlist = getMnemonicWordlist()

  return bip39.generateMnemonic(wordlist, strength)
}
