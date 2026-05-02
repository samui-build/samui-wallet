import { address, blockhash } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NATIVE_MINT } from '../src/constants.ts'
import {
  formatSimulatedTransactionChange,
  getSimulatedTransactionChangeRows,
} from '../src/get-simulated-transaction-change-rows.ts'
import type { SimulatePreparedTransactionResult } from '../src/simulate-prepared-transaction.ts'

describe('get-simulated-transaction-change-rows', () => {
  const account = address('So11111111111111111111111111111111111111113')
  const latestBlockhash = {
    blockhash: blockhash('11111111111111111111111111111111'),
    lastValidBlockHeight: 1n,
  }
  const mint = address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  const tokenAccount = address('So11111111111111111111111111111111111111114')

  describe('expected behavior', () => {
    it('should create reusable change rows from simulation data', () => {
      // ARRANGE
      expect.assertions(1)
      const simulation = createSimulation({
        solBalanceChanges: [
          {
            address: account,
            change: -5000n,
            postBalance: 95_000n,
            preBalance: 100_000n,
          },
        ],
        tokenBalanceChanges: [
          {
            account: tokenAccount,
            change: 42n,
            decimals: 6,
            mint,
            postAmount: 42n,
            preAmount: 0n,
          },
        ],
      })

      // ACT
      const result = getSimulatedTransactionChangeRows({ simulation })

      // ASSERT
      expect(result).toEqual([
        {
          address: account,
          change: -5000n,
          decimals: 9,
          mint: NATIVE_MINT,
          type: 'sol',
        },
        {
          address: tokenAccount,
          change: 42n,
          decimals: 6,
          mint,
          type: 'token',
        },
      ])
    })

    it('should format signed changes', () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result1 = formatSimulatedTransactionChange({ change: 42_000_000n, decimals: 6 })
      const result2 = formatSimulatedTransactionChange({ change: -5000n, decimals: 9 })
      const result3 = formatSimulatedTransactionChange({ change: 9_007_199_254_740_993n, decimals: 6 })

      // ASSERT
      expect(result1).toBe('+42')
      expect(result2).toBe('-0.000005')
      expect(result3).toBe('+9,007,199,254.740993')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return no rows when simulation has no balance changes', () => {
      // ARRANGE
      expect.assertions(1)
      const simulation = createSimulation({
        solBalanceChanges: [],
        tokenBalanceChanges: [],
      })

      // ACT
      const result = getSimulatedTransactionChangeRows({ simulation })

      // ASSERT
      expect(result).toEqual([])
    })
  })

  function createSimulation({
    solBalanceChanges,
    tokenBalanceChanges,
  }: {
    solBalanceChanges: Extract<SimulatePreparedTransactionResult, { status: 'success' }>['solBalanceChanges']
    tokenBalanceChanges: Extract<SimulatePreparedTransactionResult, { status: 'success' }>['tokenBalanceChanges']
  }): Extract<SimulatePreparedTransactionResult, { status: 'success' }> {
    return {
      error: null,
      fee: 5000n,
      latestBlockhash,
      logs: [],
      solBalanceChanges,
      status: 'success',
      tokenBalanceChanges,
      unitsConsumed: 123n,
    }
  }
})
