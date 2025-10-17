import { describe, expect, it } from 'vitest'

import { convertKeyPairToJson } from './convert-key-pair-to-json'
import { createKeyPairSignerFromBip39 } from './create-key-pair-signer-from-bip39'
import { createKeyPairSignerFromJson } from './create-key-pair-signer-from-json'

describe('create-key-pair-signer-from-json', () => {
  describe('expected behavior', () => {
    it('should create a KeyPairSigner from a JSON string', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const keyPairSigner = await createKeyPairSignerFromBip39({ extractable: true, mnemonic })
      const json = await convertKeyPairToJson(keyPairSigner.keyPair)

      // ACT
      const result = await createKeyPairSignerFromJson({ json })

      // ASSERT
      expect(result.address).toBe(keyPairSigner.address)
    })

    it('should create an extractable keypair when specified', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter'
      const keyPairSigner = await createKeyPairSignerFromBip39({ extractable: true, mnemonic })
      const json = await convertKeyPairToJson(keyPairSigner.keyPair)

      // ACT
      const result = await createKeyPairSignerFromJson({ extractable: true, json })
      const jwk = await crypto.subtle.exportKey('jwk', result.keyPair.privateKey)

      // ASSERT
      expect(jwk).toBeDefined()
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for invalid JSON', async () => {
      // ARRANGE
      expect.assertions(1)
      const json = 'invalid-json'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromJson({ json })).rejects.toThrow('Invalid JSON: failed to parse')
    })

    it('should throw an error for a JSON that is not a 64-byte array', async () => {
      // ARRANGE
      expect.assertions(1)
      const json = '[1,2,3]'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromJson({ json })).rejects.toThrow('Invalid JSON: expected a 64-byte array')
    })
  })
})
