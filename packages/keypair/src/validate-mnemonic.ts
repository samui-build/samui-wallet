import * as bip39 from '@scure/bip39'

import { getMnemonicWordlist } from './get-mnemonic-wordlist'

export function validateMnemonic({ mnemonic }: { mnemonic: string }) {
  const wordlist = getMnemonicWordlist()
  if (!bip39.validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic')
  }
  return mnemonic
}
