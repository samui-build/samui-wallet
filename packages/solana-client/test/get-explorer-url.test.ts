import { describe, expect, it } from 'vitest'
import type { GetExplorerUrlProps } from '../src/get-explorer-url.ts'
import { getExplorerUrl } from '../src/get-explorer-url.ts'

describe('get-explorer-url', () => {
  const address = 'GNJq3_8_1bA3e1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a'
  const signature = 'GNJq3_8_1bA3e1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a1B3a'
  const block = '123456'

  describe('expected behavior', () => {
    describe('provider: solana', () => {
      it('should create a URL for an address on devnet', () => {
        // ARRANGE
        expect.assertions(1)
        const props: GetExplorerUrlProps = {
          network: { endpoint: 'https://api.devnet.solana.com', type: 'solana:devnet' },
          path: `/address/${address}`,
        }
        const expected = `https://explorer.solana.com/address/${address}?cluster=devnet`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })

      it('should create a URL for a transaction on mainnet', () => {
        // ARRANGE
        expect.assertions(1)
        const props: GetExplorerUrlProps = {
          network: {
            endpoint: 'https://api.mainnet-beta.solana.com',
            type: 'solana:mainnet',
          },
          path: `/tx/${signature}`,
        }
        const expected = `https://explorer.solana.com/tx/${signature}`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })

      it('should create a URL for a block on localnet', () => {
        // ARRANGE
        expect.assertions(1)
        const endpoint = 'http://127.0.0.1:8899'
        const props: GetExplorerUrlProps = {
          network: {
            endpoint,
            type: 'solana:localnet',
          },
          path: `/block/${block}`,
        }
        const expected = `https://explorer.solana.com/block/${block}?cluster=custom&customUrl=${encodeURIComponent(endpoint)}`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })
    })

    describe('provider: solscan', () => {
      it('should create a URL for an address on devnet', () => {
        // ARRANGE
        expect.assertions(1)
        const props: GetExplorerUrlProps = {
          network: {
            endpoint: 'https://api.devnet.solana.com',
            type: 'solana:devnet',
          },
          path: `/address/${address}`,
          provider: 'solscan',
        }
        const expected = `https://solscan.io/address/${address}?cluster=devnet`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })

      it('should create a URL for a transaction on mainnet', () => {
        // ARRANGE
        expect.assertions(1)
        const props: GetExplorerUrlProps = {
          network: {
            endpoint: 'https://api.mainnet-beta.solana.com',
            type: 'solana:mainnet',
          },
          path: `/tx/${signature}`,
          provider: 'solscan',
        }
        const expected = `https://solscan.io/tx/${signature}`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })

      it('should create a URL for a block on localnet', () => {
        // ARRANGE
        expect.assertions(1)
        const endpoint = 'http://127.0.0.1:8899'
        const props: GetExplorerUrlProps = {
          network: {
            endpoint,
            type: 'solana:localnet',
          },
          path: `/block/${block}`,
          provider: 'solscan',
        }
        const expected = `https://solscan.io/block/${block}?cluster=custom&customUrl=${encodeURIComponent(endpoint)}`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })
    })

    describe('provider: orb', () => {
      it('should create a URL for an address on devnet', () => {
        // ARRANGE
        expect.assertions(1)
        const props: GetExplorerUrlProps = {
          network: {
            endpoint: 'https://api.devnet.solana.com',
            type: 'solana:devnet',
          },
          path: `/address/${address}`,
          provider: 'orb',
        }
        const expected = `https://orb.helius.dev/address/${address}?cluster=devnet`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })

      it('should create a URL for a transaction on mainnet', () => {
        // ARRANGE
        expect.assertions(1)
        const props: GetExplorerUrlProps = {
          network: {
            endpoint: 'https://api.mainnet-beta.solana.com',
            type: 'solana:mainnet',
          },
          path: `/tx/${signature}`,
          provider: 'orb',
        }
        const expected = `https://orb.helius.dev/tx/${signature}`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })

      it('should create a URL for a block on localnet', () => {
        // ARRANGE
        expect.assertions(1)
        const endpoint = 'http://127.0.0.1:8899'
        const props: GetExplorerUrlProps = {
          network: {
            endpoint,
            type: 'solana:localnet',
          },
          path: `/block/${block}`,
          provider: 'orb',
        }
        const expected = `https://orb.helius.dev/block/${block}?cluster=custom&customUrl=${encodeURIComponent(endpoint)}`

        // ACT
        const result = getExplorerUrl(props)

        // ASSERT
        expect(result).toBe(expected)
      })
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid path', () => {
      // ARRANGE
      expect.assertions(1)
      const props: GetExplorerUrlProps = {
        network: {
          endpoint: 'https://api.devnet.solana.com',
          type: 'solana:devnet',
        },

        // @ts-expect-error testing invalid path
        path: `/invalid/${address}`,
      }

      // ACT & ASSERT
      expect(() => getExplorerUrl(props)).toThrow()
    })

    it('should throw an error for an invalid provider', () => {
      // ARRANGE
      expect.assertions(1)
      const props: GetExplorerUrlProps = {
        network: {
          endpoint: 'https://api.devnet.solana.com',
          type: 'solana:devnet',
        },
        path: `/address/${address}`,
        // @ts-expect-error testing invalid provider
        provider: 'invalid-provider',
      }

      // ACT & ASSERT
      expect(() => getExplorerUrl(props)).toThrow()
    })
  })
})
