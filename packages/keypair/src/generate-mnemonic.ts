import * as bip39 from '@scure/bip39'

import { getMnemonicWordlist } from './get-mnemonic-wordlist'

export function generateMnemonic({
  language = 'english',
  words = 12,
}: { language?: 'english' | 'spanish'; words?: 12 | 24 } = {}): string {
  const wordlist = getMnemonicWordlist(language)

  return bip39.generateMnemonic(wordlist, words === 12 ? 128 : 256)
}
