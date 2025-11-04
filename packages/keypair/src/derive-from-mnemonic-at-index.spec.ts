import { describe, expect, it } from 'vitest'

import { deriveFromMnemonicAtIndex } from './derive-from-mnemonic-at-index.ts'

describe('derive-from-mnemonic-at-index', () => {
  describe('expected behavior', () => {
    it('should derive a wallet at a specific index from a mnemonic', async () => {
      // ARRANGE
      expect.assertions(2)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const derivationIndex = 1
      const expectedAddress = 'AWjbG5SH5VEay5ksZbGHHgJhYRhM1rsN5Z538cfFvs4a'

      // ACT
      const result = await deriveFromMnemonicAtIndex({ derivationIndex, mnemonic })

      // ASSERT
      expect(result.publicKey).toBe(expectedAddress)
      expect(result.secretKey).toBeDefined()
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'this is not a valid mnemonic'

      // ACT & ASSERT
      await expect(deriveFromMnemonicAtIndex({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for an empty mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = ''

      // ACT & ASSERT
      await expect(deriveFromMnemonicAtIndex({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a wrong word count', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'one two three'

      // ACT & ASSERT
      await expect(deriveFromMnemonicAtIndex({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a word not in the wordlist', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'afford canoe observe bone master venture shoot erode regular coffee dose blockchain'

      // ACT & ASSERT
      await expect(deriveFromMnemonicAtIndex({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a negative derivation index', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const derivationIndex = -1

      // ACT & ASSERT
      await expect(deriveFromMnemonicAtIndex({ derivationIndex, mnemonic })).rejects.toThrow(
        'Error creating KeyPair signer from mnemonic',
      )
    })
  })
})
