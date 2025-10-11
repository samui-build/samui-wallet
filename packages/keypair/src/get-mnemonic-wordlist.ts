import { wordlist as wordlistEnglish } from '@scure/bip39/wordlists/english'
import { wordlist as wordlistSpanish } from '@scure/bip39/wordlists/spanish'

export function getMnemonicWordlist(language: 'english' | 'spanish'): string[] {
  switch (language) {
    case 'english':
      return wordlistEnglish
    case 'spanish':
      return wordlistSpanish
    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}
