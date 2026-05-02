import { address } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getSimulatedSolBalanceChanges } from '../src/get-simulated-sol-balance-changes.ts'
import type { RawParsedAccount } from '../src/simulate-prepared-transaction-types.ts'

describe('get-simulated-sol-balance-changes', () => {
  const account = address('So11111111111111111111111111111111111111112')
  const systemAccount = address('11111111111111111111111111111111')

  describe('expected behavior', () => {
    it('should calculate SOL balance changes from pre and post balance arrays', () => {
      // ARRANGE
      expect.assertions(1)
      const accountAddresses = [account, systemAccount]

      // ACT
      const result = getSimulatedSolBalanceChanges({
        accountAddresses,
        postAccounts: undefined,
        postBalances: [125_000n, '80'],
        preAccounts: [],
        preBalances: ['100000', 100n],
      })

      // ASSERT
      expect(result).toEqual([
        {
          address: systemAccount,
          change: -20n,
          postBalance: 80n,
          preBalance: 100n,
        },
        {
          address: account,
          change: 25_000n,
          postBalance: 125_000n,
          preBalance: 100_000n,
        },
      ])
    })

    it('should calculate closed-account SOL balance changes from account fallback data', () => {
      // ARRANGE
      expect.assertions(1)
      const accountAddresses = [account]
      const preAccount = createAccount({ lamports: 2_039_280n })

      // ACT
      const result = getSimulatedSolBalanceChanges({
        accountAddresses,
        postAccounts: [null],
        postBalances: undefined,
        preAccounts: [preAccount],
        preBalances: undefined,
      })

      // ASSERT
      expect(result).toEqual([
        {
          address: account,
          change: -2_039_280n,
          postBalance: 0n,
          preBalance: 2_039_280n,
        },
      ])
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return no rows when no balance data is available', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = getSimulatedSolBalanceChanges({
        accountAddresses: [account],
        postAccounts: undefined,
        postBalances: undefined,
        preAccounts: [],
        preBalances: undefined,
      })

      // ASSERT
      expect(result).toEqual([])
    })
  })

  function createAccount({ lamports }: { lamports: bigint }): RawParsedAccount {
    return {
      data: ['', 'base64'],
      lamports,
      owner: systemAccount,
    }
  }
})
