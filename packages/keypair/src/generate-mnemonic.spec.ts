import { describe, expect, it } from 'vitest'
import { generateMnemonic } from './generate-mnemonic'
import { getMnemonicWordlist } from './get-mnemonic-wordlist'

describe('generate-mnemonic', () => {
  it('should generate a 12-word mnemonic in english', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist('english')
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
    const wordlist = getMnemonicWordlist('english')
    // ACT
    const result = generateMnemonic({ words: 24 })
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(24)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })

  it('should generate a 12-word mnemonic in spanish', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist('spanish')
    // ACT
    const result = generateMnemonic({ language: 'spanish' })
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(12)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })

  it('should generate a 24-word mnemonic in spanish', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist('spanish')
    // ACT
    const result = generateMnemonic({ language: 'spanish', words: 24 })
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(24)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })
})
