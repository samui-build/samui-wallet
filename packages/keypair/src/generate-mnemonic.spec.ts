import { describe, expect, it } from 'vitest'

import { generateMnemonic } from './generate-mnemonic'
import { getMnemonicWordlist } from './get-mnemonic-wordlist'

describe('generate-mnemonic', () => {
  it('should generate a 12-word mnemonic', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist()
    // ACT
    const result = generateMnemonic()
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(12)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })

  it('should generate a 24-word mnemonic', async () => {
    // ARRANGE
    expect.assertions(3)
    const wordlist = getMnemonicWordlist()
    // ACT
    const result = generateMnemonic({ strength: 256 })
    // ASSERT
    expect(typeof result).toEqual('string')
    expect(result.split(' ').length).toEqual(24)
    expect(result.split(' ').every((word) => wordlist.includes(word))).toEqual(true)
  })
})
