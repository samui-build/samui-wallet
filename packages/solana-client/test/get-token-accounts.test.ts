import { address } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '../src/constants.ts'
import { getTokenAccounts } from '../src/get-token-accounts.ts'
import { getTokenAccountsForProgramId } from '../src/get-token-accounts-for-program-id.ts'
import type { SolanaClient } from '../src/solana-client.ts'

const tokenAccount = vi.hoisted(() => ({
  account: {},
  pubkey: 'So11111111111111111111111111111111111111112',
}))
const token2022Account = vi.hoisted(() => ({
  account: {},
  pubkey: 'So11111111111111111111111111111111111111113',
}))
const getTokenAccountsForProgramIdMock = vi.hoisted(() =>
  vi.fn(async (_client, { programId }) => ({
    context: {
      slot: 1n,
    },
    value: programId === TOKEN_PROGRAM_ADDRESS ? [tokenAccount] : [token2022Account],
  })),
)

vi.mock('../src/get-token-accounts-for-program-id.ts', () => ({
  getTokenAccountsForProgramId: getTokenAccountsForProgramIdMock,
}))

describe('get-token-accounts', () => {
  const accountAddress = address('So11111111111111111111111111111111111111112')
  const client = {
    rpc: {},
    rpcSubscriptions: {},
  } as SolanaClient

  beforeEach(() => {
    vi.clearAllMocks()
    getTokenAccountsForProgramIdMock.mockImplementation(async (_client, { programId }) => ({
      context: {
        slot: 1n,
      },
      value: programId === TOKEN_PROGRAM_ADDRESS ? [tokenAccount] : [token2022Account],
    }))
  })

  describe('expected behavior', () => {
    it('should get token and token 2022 accounts for an address', async () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result = await getTokenAccounts(client, { address: accountAddress })

      // ASSERT
      expect(getTokenAccountsForProgramId).toHaveBeenCalledWith(client, {
        address: accountAddress,
        programId: TOKEN_PROGRAM_ADDRESS,
      })
      expect(getTokenAccountsForProgramId).toHaveBeenCalledWith(client, {
        address: accountAddress,
        programId: TOKEN_2022_PROGRAM_ADDRESS,
      })
      expect(result).toStrictEqual([tokenAccount, token2022Account])
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw when a token account request fails', async () => {
      // ARRANGE
      expect.assertions(1)
      getTokenAccountsForProgramIdMock.mockRejectedValue(new Error('RPC error'))

      // ACT & ASSERT
      await expect(getTokenAccounts(client, { address: accountAddress })).rejects.toThrow('RPC error')
    })
  })
})
