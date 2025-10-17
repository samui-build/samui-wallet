import { describe, expect, it } from 'vitest'

import { createSeedFromMnemonic } from './create-seed-from-mnemonic'

describe('create-seed-from-mnemonic', () => {
  describe('expected behavior', () => {
    it('should create a seed from a mnemonic', async () => {
      // ARRANGE
      expect.assertions(2)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'

      // ACT
      const result = await createSeedFromMnemonic({ mnemonic })

      // ASSERT
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(64)
    })

    it('should create a seed from a mnemonic with a passphrase', async () => {
      // ARRANGE
      expect.assertions(2)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const passphrase = 'test-passphrase'

      // ACT
      const result = await createSeedFromMnemonic({ mnemonic, passphrase })

      // ASSERT
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(64)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'this is not a valid mnemonic'

      // ACT & ASSERT
      await expect(createSeedFromMnemonic({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for an empty mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = ''

      // ACT & ASSERT
      await expect(createSeedFromMnemonic({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a wrong word count', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'one two three'

      // ACT & ASSERT
      await expect(createSeedFromMnemonic({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a word not in the wordlist', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'dummy canoe observe bone master venture shoot erode regular coffee dose zebra'

      // ACT & ASSERT
      await expect(createSeedFromMnemonic({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })
  })
})
