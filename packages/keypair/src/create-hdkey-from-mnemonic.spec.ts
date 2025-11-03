import { HDKey } from 'micro-key-producer/slip10.js'
import { describe, expect, it } from 'vitest'

import { createHDKeyFromMnemonic } from './create-hdkey-from-mnemonic.ts'

describe('create-hdkey-from-mnemonic', () => {
  describe('expected behavior', () => {
    it('should create an HDKey from a mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'

      // ACT
      const result = await createHDKeyFromMnemonic({ mnemonic })

      // ASSERT
      expect(result).toBeInstanceOf(HDKey)
    })

    it('should create an HDKey from a mnemonic with a passphrase', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const passphrase = 'test-passphrase'

      // ACT
      const result = await createHDKeyFromMnemonic({ mnemonic, passphrase })

      // ASSERT
      expect(result).toBeInstanceOf(HDKey)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'this is not a valid mnemonic'

      // ACT & ASSERT
      await expect(createHDKeyFromMnemonic({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })
  })
})
