import { address, signature } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getActivity } from '../src/get-activity.ts'
import type { SolanaClient } from '../src/solana-client.ts'

describe('get-activity', () => {
  const accountAddress = address('So11111111111111111111111111111111111111112')
  const activity = [
    {
      blockTime: 1_700_000_000n,
      confirmationStatus: 'confirmed',
      err: null,
      memo: null,
      signature: signature('5kPDfM5dLwW4bXH4qN6VQKB2mg6zKZBfbioU1fF3KJXtDrnAhxgGq2XBChsG69X8rByE9bkobcPVkKw7hRyQqb5b'),
      slot: 1n,
    },
  ]
  const send = vi.fn()
  const getSignaturesForAddress = vi.fn(() => ({ send }))
  const client = {
    rpc: {
      getSignaturesForAddress,
    },
    rpcSubscriptions: {},
  } as unknown as SolanaClient

  beforeEach(() => {
    vi.clearAllMocks()
    send.mockResolvedValue(activity)
  })

  describe('expected behavior', () => {
    it('should get activity for an address', async () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result = await getActivity(client, { address: accountAddress })

      // ASSERT
      expect(getSignaturesForAddress).toHaveBeenCalledWith(accountAddress)
      expect(send).toHaveBeenCalledWith()
      expect(result).toBe(activity)
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
      await expect(getActivity(client, { address: accountAddress })).rejects.toThrow('RPC error')
    })
  })
})
