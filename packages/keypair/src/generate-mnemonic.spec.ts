import { describe, expect, it } from 'vitest'

import { generateMnemonic } from './generate-mnemonic'
import { getMnemonicWordlist } from './get-mnemonic-wordlist'

describe('generate-mnemonic', () => {
  describe('expected behavior', () => {
    it('should generate a 12-word mnemonic', () => {
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

    it('should generate a 24-word mnemonic', () => {
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

  describe('unexpected behavior', () => {
    it('should throw an error for invalid strength', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      // @ts-expect-error: testing invalid input
      expect(() => generateMnemonic({ strength: 512 })).toThrow('strength must be 128 or 256')
    })
  })
})
