import { address, blockhash } from '@solana/kit'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import type { SimulatePreparedTransactionResult } from '@workspace/solana-client/simulate-prepared-transaction'
import { describe, expect, it } from 'vitest'
import type { TokenBalance } from '../src/data-access/use-get-token-metadata.ts'
import { getSendConfirmChangeRows } from '../src/ui/portfolio-ui-send-confirm-changes.tsx'

describe('portfolio-ui-send-confirm-changes', () => {
  const mint = address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  const owner = address('So11111111111111111111111111111111111111113')
  const tokenAccount = address('So11111111111111111111111111111111111111114')
  const latestBlockhash = {
    blockhash: blockhash('11111111111111111111111111111111'),
    lastValidBlockHeight: 1n,
  }
  const tokenBalance: TokenBalance = {
    account: owner,
    balance: 1_000n,
    decimals: 6,
    metadata: {
      decimals: 6,
      icon: '',
      id: mint,
      name: 'Test Token',
      symbol: 'TEST',
      usdPrice: 1,
    },
    mint,
  }

  describe('expected behavior', () => {
    it('should create change rows from simulation data only', () => {
      // ARRANGE
      expect.assertions(1)
      const simulation: Extract<SimulatePreparedTransactionResult, { status: 'success' }> = {
        error: null,
        fee: 5000n,
        latestBlockhash,
        logs: [],
        solBalanceChanges: [
          {
            address: owner,
            change: -5000n,
            postBalance: 95_000n,
            preBalance: 100_000n,
          },
        ],
        status: 'success',
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
        unitsConsumed: 123n,
      }

      // ACT
      const result = getSendConfirmChangeRows({ mint: tokenBalance, simulation })

      // ASSERT
      expect(result).toEqual([
        {
          address: owner,
          change: -5000n,
          decimals: 9,
          tokenLabel: 'SOL',
          tokenTitle: NATIVE_MINT,
        },
        {
          address: tokenAccount,
          change: 42n,
          decimals: 6,
          tokenLabel: 'TEST',
          tokenTitle: mint,
        },
      ])
    })
  })
})
