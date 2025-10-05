import * as bip39 from '@scure/bip39'

import { getMnemonicWordlist, MnemonicLanguage } from './get-mnemonic-wordlist.js'

export enum MnemonicStrength {
  Double = '24',
  Single = '12',
}

export function generateMnemonic({
  language = MnemonicLanguage['English'],
  strength = MnemonicStrength['Single'],
}: { language?: MnemonicLanguage; strength?: MnemonicStrength } = {}): string {
  const wordlist = getMnemonicWordlist(language)

  return bip39.generateMnemonic(wordlist, strength === MnemonicStrength['Single'] ? 128 : 256)
}
