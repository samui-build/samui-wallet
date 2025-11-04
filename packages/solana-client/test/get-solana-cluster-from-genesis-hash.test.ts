import { describe, expect, it } from 'vitest'

import { GENESIS_HASH, getSolanaClusterFromGenesisHash } from '../src/get-solana-cluster-from-genesis-hash.ts'

describe('get-solana-cluster-from-genesis-hash', () => {
  describe('expected behavior', () => {
    it('should return solana:devnet for devnet genesis hash', () => {
      // ARRANGE
      expect.assertions(1)
      const hash = GENESIS_HASH.devnet

      // ACT
      const result = getSolanaClusterFromGenesisHash(hash)

      // ASSERT
      expect(result).toBe('solana:devnet')
    })

    it('should return solana:mainnet for mainnet genesis hash', () => {
      // ARRANGE
      expect.assertions(1)
      const hash = GENESIS_HASH.mainnet

      // ACT
      const result = getSolanaClusterFromGenesisHash(hash)

      // ASSERT
      expect(result).toBe('solana:mainnet')
    })

    it('should return solana:testnet for testnet genesis hash', () => {
      // ARRANGE
      expect.assertions(1)
      const hash = GENESIS_HASH.testnet

      // ACT
      const result = getSolanaClusterFromGenesisHash(hash)

      // ASSERT
      expect(result).toBe('solana:testnet')
    })

    it('should return solana:localnet for unknown genesis hash', () => {
      // ARRANGE
      expect.assertions(1)
      const hash = 'UnknownGenesisHashThatDoesNotExist123456789'

      // ACT
      const result = getSolanaClusterFromGenesisHash(hash)

      // ASSERT
      expect(result).toBe('solana:localnet')
    })

    it('should return solana:localnet for empty string', () => {
      // ARRANGE
      expect.assertions(1)
      const hash = ''

      // ACT
      const result = getSolanaClusterFromGenesisHash(hash)

      // ASSERT
      expect(result).toBe('solana:localnet')
    })
  })
})
