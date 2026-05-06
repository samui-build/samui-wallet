import { address } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getAccountInfo } from '../src/get-account-info.ts'
import type { SolanaClient } from '../src/solana-client.ts'

describe('get-account-info', () => {
  const accountAddress = address('So11111111111111111111111111111111111111112')
  const accountInfo = {
    context: {
      slot: 1n,
    },
    value: null,
  }
  const send = vi.fn()
  const getAccountInfoMock = vi.fn(() => ({ send }))
  const client = {
    rpc: {
      getAccountInfo: getAccountInfoMock,
    },
    rpcSubscriptions: {},
  } as unknown as SolanaClient

  beforeEach(() => {
    vi.clearAllMocks()
    send.mockResolvedValue(accountInfo)
  })

  describe('expected behavior', () => {
    it('should get account info for an address', async () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result = await getAccountInfo(client, { address: accountAddress })

      // ASSERT
      expect(getAccountInfoMock).toHaveBeenCalledWith(accountAddress)
      expect(send).toHaveBeenCalledWith()
      expect(result).toBe(accountInfo)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw when the rpc request fails', async () => {
      // ARRANGE
      expect.assertions(1)
      send.mockRejectedValue(new Error('RPC error'))

      // ACT & ASSERT
      await expect(getAccountInfo(client, { address: accountAddress })).rejects.toThrow('RPC error')
    })
  })
})
