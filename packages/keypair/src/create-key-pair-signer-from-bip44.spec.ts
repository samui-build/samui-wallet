import { describe, expect, it } from 'vitest'

import { createKeyPairSignerFromBip44 } from './create-key-pair-signer-from-bip44.ts'

describe('create-key-pair-signer-from-bip44', () => {
  describe('expected behavior', () => {
    it('should create a keypair signer from a mnemonic set', async () => {
      // ARRANGE
      expect.assertions(2)
      const mnemonic = 'kid search occur scrub tumble dove transfer prevent mirror brush gravity fork'
      const addresses = [
        'Sse6jwfCWiULhm9JYZ8zRCYQW39FavVdsDG3BEPqPLP',
        'GNmrTk9RSmkbith158xKQoF9jwRwz9jxsPE2xNrvVeGG',
        '3tsF1zkbPPzyxaBZMGKYFuUA5NHzWEwyLAK6XYhUa8eP',
        '3fSmpZ2PrWj9ijMpWQKLM7wetzTJmU5GonHbrpSq9v3x',
      ]
      // ACT
      const result = await createKeyPairSignerFromBip44({ mnemonic, to: 4 })
      // ASSERT
      expect(result.map((s) => s.address)).toEqual(addresses)
      expect(result.length).toEqual(4)
    })

    it('should create a keypair signer from a mnemonic set with passphrase', async () => {
      // ARRANGE
      expect.assertions(2)
      const mnemonic = 'toy inner shy cup come mansion nurse curtain anger spatial blush vessel'
      const addresses = [
        'SBsMscGCqSQiD8YKygSr3zyU9S41EFCMGBbsqDdh4Jx',
        'Hrue7ZeLn51qKf5N8xX3QYfJS6xXzZCgv2LkKunUfsXs',
        '7EsaA27a4742Hy5CpEfH8SXKHhiDaDL8JGsSsh1raipS',
        'EMkbgVEkJpvFXBrceJNJgaioA7bYL3BrafvjZAorfpuy',
      ]
      const passphrase = 'foobar'
      // ACT
      const result = await createKeyPairSignerFromBip44({ mnemonic, passphrase, to: 4 })
      // ASSERT
      expect(result.map((s) => s.address)).toEqual(addresses)
      expect(result.length).toEqual(4)
    })

    it('should create a non-extractable keypair by default', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'kid search occur scrub tumble dove transfer prevent mirror brush gravity fork'

      // ACT
      const result = await createKeyPairSignerFromBip44({ mnemonic, to: 1 })
      if (!result[0]) {
        throw new Error('keypair not created')
      }
      const keyPair = result[0].keyPair

      // ASSERT
      await expect(crypto.subtle.exportKey('jwk', keyPair.privateKey)).rejects.toThrow('key is not extractable')
    })

    it('should create an extractable keypair when specified', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'kid search occur scrub tumble dove transfer prevent mirror brush gravity fork'

      // ACT
      const result = await createKeyPairSignerFromBip44({ extractable: true, mnemonic, to: 1 })
      if (!result[0]) {
        throw new Error('keypair not created')
      }
      const keyPair = result[0].keyPair
      const jwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey)

      // ASSERT
      expect(jwk).toBeDefined()
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'this is not a valid mnemonic'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip44({ mnemonic, to: 1 })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for an empty mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = ''

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip44({ mnemonic, to: 1 })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a wrong word count', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'one two three'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip44({ mnemonic, to: 1 })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a word not in the wordlist', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'dummy canoe observe bone master venture shoot erode regular coffee dose zebra'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip44({ mnemonic, to: 1 })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error if to is 0', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'kid search occur scrub tumble dove transfer prevent mirror brush gravity fork'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip44({ mnemonic, to: 0 })).rejects.toThrow('to must be a positive number')
    })

    it('should throw an error if to is negative', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'kid search occur scrub tumble dove transfer prevent mirror brush gravity fork'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip44({ mnemonic, to: -1 })).rejects.toThrow('to must be a positive number')
    })

    it('should throw an error if from is negative', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'kid search occur scrub tumble dove transfer prevent mirror brush gravity fork'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip44({ from: -1, mnemonic })).rejects.toThrow(
        'from must be a positive number',
      )
    })

    it('should throw an error if to is not greater than from', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'kid search occur scrub tumble dove transfer prevent mirror brush gravity fork'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip44({ from: 1, mnemonic, to: 1 })).rejects.toThrow(
        'to must be greater than from',
      )
    })
  })
})
