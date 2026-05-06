import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { solanaSignatureSchema } from '../src/solana/solana-signature-schema.ts'

describe('solanaSignatureSchema', () => {
  describe('expected behavior', () => {
    it('should parse a valid Solana signature', () => {
      // ARRANGE
      expect.assertions(1)
      const signature = '2RHM8HGK1NaHrWPnfLMDeBsANJAUh1NWefpYctp4v9ZCgLWVjczA8bsjubm4hDEdrdB5XQLKfkHYUoghZftfo1mZ'

      // ACT
      const result = solanaSignatureSchema.safeParse(signature)

      // ASSERT
      expect(result.success).toBe(true)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should not parse a null value', () => {
      // ARRANGE
      expect.assertions(1)
      const signature = null

      // ACT
      const result = solanaSignatureSchema.safeParse(signature)

      // ASSERT
      expect(result.success).toBe(false)
    })

    it('should not parse an empty string', () => {
      // ARRANGE
      expect.assertions(2)
      const signature = ''

      // ACT
      const result = solanaSignatureSchema.safeParse(signature)

      // ASSERT
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Invalid Solana signature')
      }
    })

    it('should not parse an invalid Solana signature', () => {
      // ARRANGE
      expect.assertions(2)
      const signature = 'invalid-signature'

      // ACT
      const result = solanaSignatureSchema.safeParse(signature)

      // ASSERT
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Invalid Solana signature')
      }
    })

    it('should not parse an undefined value', () => {
      // ARRANGE
      expect.assertions(1)
      const signature = undefined

      // ACT
      const result = solanaSignatureSchema.safeParse(signature)

      // ASSERT
      expect(result.success).toBe(false)
    })
  })
})
