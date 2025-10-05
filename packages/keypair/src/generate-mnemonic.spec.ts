import { describe, expect, it } from 'vitest'

import { generateMnemonic, MnemonicStrength } from './generate-mnemonic'
import { getMnemonicWordlist, MnemonicLanguage } from './get-mnemonic-wordlist'

describe('generate-mnemonic', () => {
  it('should generate a 12-word mnemonic in english', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist(MnemonicLanguage.English)
    // ACT
    const result = generateMnemonic()
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(12)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })

  it('should generate a 24-word mnemonic in english', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist(MnemonicLanguage.English)
    // ACT
    const result = generateMnemonic({ strength: MnemonicStrength.Double })
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(24)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })

  it('should generate a 12-word mnemonic in spanish', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist(MnemonicLanguage.Spanish)
    // ACT
    const result = generateMnemonic({ language: MnemonicLanguage.Spanish })
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(12)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })

  it('should generate a 24-word mnemonic in spanish', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist(MnemonicLanguage.Spanish)
    // ACT
    const result = generateMnemonic({ language: MnemonicLanguage.Spanish, strength: MnemonicStrength.Double })
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(24)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })
})
