import { getAddressFromPublicKey } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { convertKeyPairToJson } from './convert-key-pair-to-json.ts'
import { importKeyPair } from './import-key-pair.ts'

describe('import-key-pair', () => {
  const inputByteArray =
    '[158,162,68,53,7,160,11,228,121,212,9,20,153,66,181,218,221,151,133,191,47,200,42,248,9,193,87,242,138,52,78,247,62,126,231,24,61,119,89,115,57,124,71,221,150,117,118,44,234,134,91,100,152,80,11,142,29,0,122,146,140,107,174,196]'
  const inputBase58 = '4AxFzQaPR6N9dWP5K3GdZRLuWJcdgPznM4h42ASqByP3c6vywVLKs32rwPPsuvsJh1E6fLjkAbe8dzhTj3w173Ky'
  const expected = '5CxWcsm9h3NfCM8WPM6eaw8LnnSmnYyEHf8BQQ56YJGK'
  describe('expected behavior', () => {
    it('should import a key pair from a byte array', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result = await importKeyPair(inputByteArray, true)

      // ASSERT
      const publicKey = await getAddressFromPublicKey(result.publicKey)
      const secretKey = await convertKeyPairToJson(result)
      expect(publicKey).toBe(expected)
      expect(secretKey).toBe(inputByteArray)
    })

    it('should import a key pair from a base58', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result = await importKeyPair(inputBase58, true)

      // ASSERT
      const publicKey = await getAddressFromPublicKey(result.publicKey)
      const secretKey = await convertKeyPairToJson(result)
      expect(publicKey).toBe(expected)
      expect(secretKey).toBe(inputByteArray)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error for an invalid input', async () => {
      // ARRANGE
      expect.assertions(1)
      const invalidInput = 'this is not a valid key'

      // ACT & ASSERT
      await expect(importKeyPair(invalidInput, true)).rejects.toThrow()
    })
  })
})
