import type { Address, KeyPairSigner } from '@solana/kit'
import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit'
import type { MockInstance } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@solana/kit', async () => {
  const actual = await vi.importActual<typeof import('@solana/kit')>('@solana/kit')
  return {
    ...actual,
    createKeyPairSignerFromPrivateKeyBytes: vi.fn(actual.createKeyPairSignerFromPrivateKeyBytes),
  }
})

import { generateVanityKeyPair, VANITY_MAX_ATTEMPTS } from './generate-vanity-key-pair.ts'

const ADDRESS_TEMPLATE = '11111111111111111111111111111111'

function createAddressValue({ prefix = '', suffix = '' }: { prefix?: string; suffix?: string } = {}): Address {
  const fillerLength = Math.max(ADDRESS_TEMPLATE.length - prefix.length - suffix.length, 0)
  const filler = ADDRESS_TEMPLATE.slice(0, fillerLength)
  const value = `${prefix}${filler}${suffix}`.slice(0, ADDRESS_TEMPLATE.length)
  return value as Address
}

function createCryptoKey(type: KeyType): CryptoKey {
  return {
    algorithm: { name: 'TEST' },
    extractable: false,
    type,
    usages: [],
  }
}

function createCryptoKeyPair(): CryptoKeyPair {
  return {
    privateKey: createCryptoKey('private'),
    publicKey: createCryptoKey('public'),
  }
}

const noopSignMessages: KeyPairSigner['signMessages'] = async () => []
const noopSignTransactions: KeyPairSigner['signTransactions'] = async () => []

function createSignerStub(overrides: Partial<KeyPairSigner> = {}): KeyPairSigner {
  const signer: KeyPairSigner = {
    address: createAddressValue(),
    keyPair: createCryptoKeyPair(),
    signMessages: noopSignMessages,
    signTransactions: noopSignTransactions,
  }
  return { ...signer, ...overrides }
}

describe('generateVanityKeyPair', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('expected behavior', () => {
    it('should generate a key pair with a specific prefix', async () => {
      // ARRANGE
      expect.assertions(2)
      const prefix = 'MAD'
      const signer = createSignerStub({ address: createAddressValue({ prefix }) })
      const spy = vi.mocked(createKeyPairSignerFromPrivateKeyBytes).mockResolvedValue(signer)

      // ACT
      const result = await generateVanityKeyPair({ prefix })

      // ASSERT
      expect(result.signer.address.startsWith(prefix)).toBe(true)
      expect(spy).toHaveBeenCalled()
    })
    it('should generate a key pair with a specific suffix', async () => {
      // ARRANGE
      expect.assertions(2)
      const suffix = 'XYZ'
      const signer = createSignerStub({ address: createAddressValue({ suffix }) })
      const spy = vi.mocked(createKeyPairSignerFromPrivateKeyBytes).mockResolvedValue(signer)

      // ACT
      const result = await generateVanityKeyPair({ suffix })

      // ASSERT
      expect(result.signer.address.endsWith(suffix)).toBe(true)
      expect(spy).toHaveBeenCalled()
    })

    it('should invoke onAttempt for every attempt', async () => {
      // ARRANGE
      expect.assertions(2)
      const attempts: number[] = []
      const addresses = ['abc', 'def', 'ghi'].map((value) => createAddressValue({ prefix: value }))
      let index = 0
      vi.mocked(createKeyPairSignerFromPrivateKeyBytes).mockImplementation(async () =>
        createSignerStub({
          address: addresses[Math.min(index++, addresses.length - 1)] ?? createAddressValue(),
        }),
      )

      // ACT
      const result = await generateVanityKeyPair({
        onAttempt: (value) => attempts.push(value),
        prefix: 'ghi',
      })

      // ASSERT
      expect(result.attempts).toBe(3)
      expect(attempts).toEqual([1, 2, 3])
    })
  })

  describe('unexpected behavior', () => {
    let consoleSpy: MockInstance

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleSpy.mockRestore()
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
      const error = new Error('crypto failure')
      vi.mocked(createKeyPairSignerFromPrivateKeyBytes).mockRejectedValue(error)

      // ACT & ASSERT
      await expect(generateVanityKeyPair({ prefix: 'A' })).rejects.toThrow('crypto failure')
    })

    it('should throw when the maximum attempts are exhausted without a match', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.mocked(createKeyPairSignerFromPrivateKeyBytes).mockResolvedValue(createSignerStub())

      // ACT & ASSERT
      await expect(generateVanityKeyPair({ maxAttempts: 2, prefix: 'ZZZ' })).rejects.toThrow(
        'No vanity match found within 2 attempts, try a shorter pattern',
      )
    })

    it('should respect the hard cap on attempts', async () => {
      // ARRANGE
      expect.assertions(2)
      const attemptsHardCap = 5
      vi.mocked(createKeyPairSignerFromPrivateKeyBytes).mockResolvedValue(createSignerStub())

      // ACT & ASSERT
      await expect(
        generateVanityKeyPair({ attemptsHardCap, maxAttempts: VANITY_MAX_ATTEMPTS + 1, prefix: 'AAA' }),
      ).rejects.toThrow(`No vanity match found within ${attemptsHardCap} attempts, try a shorter pattern`)
      expect(createKeyPairSignerFromPrivateKeyBytes).toHaveBeenCalledTimes(attemptsHardCap)
    })
  })
})
