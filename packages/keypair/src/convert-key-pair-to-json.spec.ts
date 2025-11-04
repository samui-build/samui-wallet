import { describe, expect, it } from 'vitest'

import { convertKeyPairToJson } from './convert-key-pair-to-json.ts'
import { createKeyPairSignerFromBip39 } from './create-key-pair-signer-from-bip39.ts'

describe('convert-key-pair-to-json', () => {
  describe('expected behavior', () => {
    it('should convert a CryptoKeyPair to a JSON string', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const keyPairSigner = await createKeyPairSignerFromBip39({ extractable: true, mnemonic })
      const cryptoKeyPair = keyPairSigner.keyPair
      const expectedJson = `[186,78,68,54,63,205,1,141,2,89,45,80,77,168,215,120,56,57,72,222,50,140,31,236,254,35,208,163,138,186,225,18,67,194,241,235,28,5,209,235,248,58,150,42,218,71,43,177,183,62,55,96,216,41,59,146,121,132,223,24,39,109,3,163]`

      // ACT
      const result = await convertKeyPairToJson(cryptoKeyPair)

      // ASSERT
      expect(result).toBe(expectedJson)
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
      await expect(convertKeyPairToJson(cryptoKeyPair)).rejects.toThrow('key is not extractable')
    })
  })
})
