import type { KeyPairSigner } from '@solana/kit'
import * as solanaKit from '@solana/kit'
import type { MockInstance } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@solana/kit', async () => {
  const actual = await vi.importActual<typeof import('@solana/kit')>('@solana/kit')
  return {
    ...actual,
    createKeyPairSignerFromPrivateKeyBytes: vi.fn(actual.createKeyPairSignerFromPrivateKeyBytes),
  }
})

import { generateVanityKeyPair } from './generate-vanity-key-pair.ts'

describe('generateVanityKeyPair', () => {
  describe('expected behavior', () => {
    it('should generate a key pair with a specific prefix', async () => {
      // ARRANGE
      expect.assertions(2)
      const prefix = 'A'

      // ACT
      const result = await generateVanityKeyPair({ prefix })

      // ASSERT
      expect(result).toBeDefined()
      expect(result.address.startsWith(prefix)).toBe(true)
    })

    it('should generate a key pair with a specific suffix', async () => {
      // ARRANGE
      expect.assertions(2)
      const suffix = 'A'

      // ACT
      const result = await generateVanityKeyPair({ suffix })

      // ASSERT
      expect(result).toBeDefined()
      expect(result.address.endsWith(suffix)).toBe(true)
    })

    it('should generate a key pair with case insensitive prefix', async () => {
      // ARRANGE
      expect.assertions(2)
      const prefix = 'a'

      // ACT
      const result = await generateVanityKeyPair({ caseSensitive: false, prefix })

      // ASSERT
      expect(result).toBeDefined()
      expect(result.address.toLowerCase().startsWith(prefix)).toBe(true)
    })
  })

  describe('unexpected behavior', () => {
    let consoleSpy: MockInstance

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'log')
      consoleSpy.mockImplementation(() => {})
    })

    afterEach(() => {
      consoleSpy.mockRestore()
      vi.restoreAllMocks()
    })

    it('should throw when prefix and suffix are missing', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(generateVanityKeyPair({})).rejects.toThrow('generateVanityKeyPair requires a prefix or suffix')
    })

    it('should surface failures from the underlying crypto primitive', async () => {
      // ARRANGE
      expect.assertions(1)
      const cryptoSpy = vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(() => {
        throw new Error('crypto failure')
      })

      // ACT & ASSERT
      await expect(generateVanityKeyPair({ prefix: 'X' })).rejects.toThrow('crypto failure')

      cryptoSpy.mockRestore()
    })

    it('should throw when the maximum attempts are exhausted without a match', async () => {
      // ARRANGE
      expect.assertions(1)
      const signerStub = {
        address: '11111111111111111111111111111111',
        keyPair: {},
      } as KeyPairSigner
      const signerSpy = vi
        .spyOn(solanaKit, 'createKeyPairSignerFromPrivateKeyBytes')
        .mockResolvedValue(signerStub as KeyPairSigner)

      // ACT & ASSERT
      await expect(generateVanityKeyPair({ maxAttempts: 2, prefix: 'ZZZ' })).rejects.toThrow(
        'No vanity match found within 2 attempts, try a shorter pattern',
      )

      signerSpy.mockRestore()
    })
  })
})
