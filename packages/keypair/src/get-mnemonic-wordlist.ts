import { wordlist as wordlistEnglish } from '@scure/bip39/wordlists/english'
import { wordlist as wordlistSpanish } from '@scure/bip39/wordlists/spanish'

export enum MnemonicLanguage {
  English = 'English',
  Spanish = 'Spanish',
}

export function getMnemonicWordlist(language: MnemonicLanguage): string[] {
  switch (language) {
    case MnemonicLanguage.English:
      return wordlistEnglish
    case MnemonicLanguage.Spanish:
      return wordlistSpanish
    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}
