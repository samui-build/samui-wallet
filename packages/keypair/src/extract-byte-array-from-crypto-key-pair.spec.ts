import { describe, expect, it } from 'vitest'

import { convertByteArrayToJson } from './convert-byte-array-to-json'
import { createKeyPairSignerFromBip39 } from './create-key-pair-signer-from-bip39'
import { extractByteArrayFromCryptoKeyPair } from './extract-byte-array-from-crypto-key-pair'

describe('extract-byte-array-from-crypto-key-pair', () => {
  describe('expected behavior', () => {
    it('should extract a 64-byte array representing the private and public keys', async () => {
      // ARRANGE
      expect.assertions(3)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const keyPairSigner = await createKeyPairSignerFromBip39({ extractable: true, mnemonic })
      const cryptoKeyPair = keyPairSigner.keyPair

      // ACT
      const result = await extractByteArrayFromCryptoKeyPair(cryptoKeyPair)

      // ASSERT
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(64)
      expect(convertByteArrayToJson(result)).toBe(
        `[186,78,68,54,63,205,1,141,2,89,45,80,77,168,215,120,56,57,72,222,50,140,31,236,254,35,208,163,138,186,225,18,67,194,241,235,28,5,209,235,248,58,150,42,218,71,43,177,183,62,55,96,216,41,59,146,121,132,223,24,39,109,3,163]`,
      )
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error if the key is not extractable', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const keyPairSigner = await createKeyPairSignerFromBip39({ extractable: false, mnemonic })
      const cryptoKeyPair = keyPairSigner.keyPair

      // ACT & ASSERT
      await expect(extractByteArrayFromCryptoKeyPair(cryptoKeyPair)).rejects.toThrow('key is not extractable')
    })

    it('should throw an error for null input', async () => {
      // ARRANGE
      expect.assertions(1)
      const invalidInput = null

      // ACT & ASSERT
      // @ts-expect-error: testing invalid input
      await expect(extractByteArrayFromCryptoKeyPair(invalidInput)).rejects.toThrow(
        `Cannot read properties of null (reading 'publicKey')`,
      )
    })

    it('should throw an error for undefined input', async () => {
      // ARRANGE
      expect.assertions(1)
      const invalidInput = undefined

      // ACT & ASSERT
      // @ts-expect-error: testing invalid input
      await expect(extractByteArrayFromCryptoKeyPair(invalidInput)).rejects.toThrow(
        `Cannot read properties of undefined (reading 'publicKey')`,
      )
    })

    it('should throw an error for a non-CryptoKeyPair object', async () => {
      // ARRANGE
      expect.assertions(1)
      const invalidInput = {}

      // ACT & ASSERT
      // @ts-expect-error: testing invalid input
      await expect(extractByteArrayFromCryptoKeyPair(invalidInput)).rejects.toThrow(
        `Failed to execute 'exportKey' on 'SubtleCrypto': 2nd argument is not of type CryptoKey.`,
      )
    })
  })
})
