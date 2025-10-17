import { describe, expect, it } from 'vitest'

import { validateMnemonic } from './validate-mnemonic'

describe('validate-mnemonic', () => {
  describe('expected behavior', () => {
    it('should not throw an error for a valid mnemonic', () => {
      // ARRANGE
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'

      // ACT & ASSERT
      expect(() => validateMnemonic({ mnemonic })).not.toThrow()
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid mnemonic', () => {
      // ARRANGE
      const mnemonic = 'this is not a valid mnemonic'

      // ACT & ASSERT
      expect(() => validateMnemonic({ mnemonic })).toThrow('Invalid mnemonic')
    })

    it('should throw an error for an empty mnemonic', () => {
      // ARRANGE
      const mnemonic = ''

      // ACT & ASSERT
      expect(() => validateMnemonic({ mnemonic })).toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a wrong word count', () => {
      // ARRANGE
      const mnemonic = 'one two three'

      // ACT & ASSERT
      expect(() => validateMnemonic({ mnemonic })).toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a word not in the wordlist', () => {
      // ARRANGE
      const mnemonic = 'dummy canoe observe bone master venture shoot erode regular coffee dose zebra'

      // ACT & ASSERT
      expect(() => validateMnemonic({ mnemonic })).toThrow('Invalid mnemonic')
    })
  })
})
