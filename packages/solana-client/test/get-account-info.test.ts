import { address } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getAccountInfo } from '../src/get-account-info.ts'
import type { SolanaClient } from '../src/solana-client.ts'

describe('get-account-info', () => {
  describe('expected behavior', () => {
    it('should call rpc.getAccountInfo with the correct address', async () => {
      // ARRANGE
      expect.assertions(2)
      const testAddress = 'So11111111111111111111111111111111111111112'
      const AccountInfo = {
        value: {
          data: new Uint8Array([1, 2, 3]),
          executable: false,
          lamports: 1000000n,
          owner: address('11111111111111111111111111111111'),
          rentEpoch: 0n,
        },
      }
      const mockSend = vi.fn().mockResolvedValue(AccountInfo)
      const mockGetAccountInfo = vi.fn().mockReturnValue({ send: mockSend })
      const mockClient = {
        rpc: {
          getAccountInfo: mockGetAccountInfo,
        },
      } as unknown as SolanaClient

      // ACT
      const result = await getAccountInfo(mockClient, { address: testAddress })

      // ASSERT
      expect(mockGetAccountInfo).toHaveBeenCalledWith(address(testAddress))
      expect(result).toEqual(AccountInfo)
    })

    it('should handle account with no data', async () => {
      // ARRANGE
      expect.assertions(1)
      const testAddress = 'So11111111111111111111111111111111111111112'
      const AccountInfo = {
        value: null,
      }
      const mockSend = vi.fn().mockResolvedValue(AccountInfo)
      const mockGetAccountInfo = vi.fn().mockReturnValue({ send: mockSend })
      const mockClient = {
        rpc: {
          getAccountInfo: mockGetAccountInfo,
        },
      } as unknown as SolanaClient

      // ACT
      const result = await getAccountInfo(mockClient, { address: testAddress })

      // ASSERT
      expect(result).toEqual(AccountInfo)
    })

    it('should handle account with executable program', async () => {
      // ARRANGE
      expect.assertions(2)
      const testAddress = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      const AccountInfo = {
        value: {
          data: new Uint8Array([1, 2, 3, 4, 5]),
          executable: true,
          lamports: 5000000n,
          owner: address('11111111111111111111111111111111'),
          rentEpoch: 100n,
        },
      }
      const mockSend = vi.fn().mockResolvedValue(AccountInfo)
      const mockGetAccountInfo = vi.fn().mockReturnValue({ send: mockSend })
      const mockClient = {
        rpc: {
          getAccountInfo: mockGetAccountInfo,
        },
      } as unknown as SolanaClient

      // ACT
      const result = await getAccountInfo(mockClient, { address: testAddress })

      // ASSERT
      expect(mockGetAccountInfo).toHaveBeenCalledWith(address(testAddress))
      expect(result.value?.executable).toBe(true)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when rpc call fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const testAddress = 'So11111111111111111111111111111111111111112'
      const mockError = new Error('RPC request failed')
      const mockSend = vi.fn().mockRejectedValue(mockError)
      const mockGetAccountInfo = vi.fn().mockReturnValue({ send: mockSend })
      const mockClient = {
        rpc: {
          getAccountInfo: mockGetAccountInfo,
        },
      } as unknown as SolanaClient

      // ACT & ASSERT
      await expect(getAccountInfo(mockClient, { address: testAddress })).rejects.toThrow('RPC request failed')
    })

    it('should throw an error with invalid address format', () => {
      // ARRANGE
      expect.assertions(1)
      const invalidAddress = 'invalid-address'
      const mockSend = vi.fn()
      const mockGetAccountInfo = vi.fn().mockReturnValue({ send: mockSend })
      const mockClient = {
        rpc: {
          getAccountInfo: mockGetAccountInfo,
        },
      } as unknown as SolanaClient

      // ACT & ASSERT
      expect(() =>
        getAccountInfo(mockClient, {
          address: invalidAddress,
        }),
      ).toThrow()
    })
  })
})
