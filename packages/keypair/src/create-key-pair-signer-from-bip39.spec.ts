import { describe, expect, it } from 'vitest'

import { createKeyPairSignerFromBip39 } from './create-key-pair-signer-from-bip39.ts'

describe('create-key-pair-signer-from-bip39', () => {
  describe('expected behavior', () => {
    it('should create a keypair signer from a mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'afford canoe observe bone master venture shoot erode regular coffee dose cute'
      const address = 'SFYog9EU62yDjJUAAhwiWvehTkvXNhW4nAbBTFzou3T'
      // ACT
      const result = await createKeyPairSignerFromBip39({ mnemonic })
      // ASSERT
      expect(result.address).toEqual(address)
    })

    it('should create a keypair signer from a mnemonic with passphrase', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'tower mandate pupil dance furnace scheme wisdom envelope next fantasy flavor merit'
      const address = 'SFDXaLas2FdpiGn9gtvaxx5jFG7L7QAwY8KvWCu6B5d'
      const passphrase = 'foobar'
      // ACT
      const result = await createKeyPairSignerFromBip39({ mnemonic, passphrase })
      // ASSERT
      expect(result.address).toEqual(address)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'this is not a valid mnemonic'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip39({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for an empty mnemonic', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = ''

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip39({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a wrong word count', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'one two three'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip39({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })

    it('should throw an error for a mnemonic with a word not in the wordlist', async () => {
      // ARRANGE
      expect.assertions(1)
      const mnemonic = 'dummy canoe observe bone master venture shoot erode regular coffee dose cute'

      // ACT & ASSERT
      await expect(createKeyPairSignerFromBip39({ mnemonic })).rejects.toThrow('Invalid mnemonic')
    })
  })
})
