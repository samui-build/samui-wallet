import { describe, expect, it } from 'vitest'

import { solanaAddressSchema } from '../src/solana/solana-address-schema.ts'

describe('solanaAddressSchema', () => {
  describe('expected behavior', () => {
    it('should parse a valid Solana address', () => {
      // ARRANGE
      expect.assertions(1)
      const address = 'So11111111111111111111111111111111111111112'

      // ACT
      const result = solanaAddressSchema.safeParse(address)

      // ASSERT
      expect(result.success).toBe(true)
    })
  })

  describe('unexpected behavior', () => {
    it('should not parse an invalid Solana address', () => {
      // ARRANGE
      expect.assertions(2)
      const address = 'invalid-address'

      // ACT
      const result = solanaAddressSchema.safeParse(address)

      // ASSERT
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Invalid Solana address')
      }
    })

    it('should not parse an empty string', () => {
      // ARRANGE
      expect.assertions(2)
      const address = ''

      // ACT
      const result = solanaAddressSchema.safeParse(address)

      // ASSERT
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Invalid Solana address')
      }
    })

    it('should not parse a null value', () => {
      // ARRANGE
      expect.assertions(1)
      const address = null

      // ACT
      const result = solanaAddressSchema.safeParse(address)

      // ASSERT
      expect(result.success).toBe(false)
    })

    it('should not parse an undefined value', () => {
      // ARRANGE
      expect.assertions(1)
      const address = undefined

      // ACT
      const result = solanaAddressSchema.safeParse(address)

      // ASSERT
      expect(result.success).toBe(false)
    })
  })
})
