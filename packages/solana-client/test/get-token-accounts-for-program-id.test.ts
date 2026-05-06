import { address } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTokenAccountsForProgramId } from '../src/get-token-accounts-for-program-id.ts'
import type { SolanaClient } from '../src/solana-client.ts'

describe('get-token-accounts-for-program-id', () => {
  const accountAddress = address('So11111111111111111111111111111111111111112')
  const programId = address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  const tokenAccounts = {
    context: {
      slot: 1n,
    },
    value: [],
  }
  const send = vi.fn()
  const getTokenAccountsByOwner = vi.fn(() => ({ send }))
  const client = {
    rpc: {
      getTokenAccountsByOwner,
    },
    rpcSubscriptions: {},
  } as unknown as SolanaClient

  beforeEach(() => {
    vi.clearAllMocks()
    send.mockResolvedValue(tokenAccounts)
  })

  describe('expected behavior', () => {
    it('should get parsed token accounts for a program id', async () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result = await getTokenAccountsForProgramId(client, { address: accountAddress, programId })

      // ASSERT
      expect(getTokenAccountsByOwner).toHaveBeenCalledWith(
        accountAddress,
        { programId },
        { commitment: 'confirmed', encoding: 'jsonParsed' },
      )
      expect(send).toHaveBeenCalledWith()
      expect(result).toBe(tokenAccounts)
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
      await expect(getTokenAccountsForProgramId(client, { address: accountAddress, programId })).rejects.toThrow(
        'RPC error',
      )
    })
  })
})
