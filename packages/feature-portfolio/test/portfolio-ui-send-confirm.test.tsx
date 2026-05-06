import { address, blockhash, generateKeyPairSigner } from '@solana/kit'
import type { SimulatePreparedTransactionResult } from '@workspace/solana-client/simulate-prepared-transaction'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { TokenBalance } from '../src/data-access/use-get-token-balances.ts'
import type { PortfolioPreparedTransaction } from '../src/data-access/use-portfolio-tx-prepare.tsx'
import { PortfolioUiSendConfirm } from '../src/ui/portfolio-ui-send-confirm.tsx'

describe('portfolio-ui-send-confirm', () => {
  const latestBlockhash = {
    blockhash: blockhash('11111111111111111111111111111111'),
    lastValidBlockHeight: 1n,
  }
  const mint: TokenBalance = {
    account: address('So11111111111111111111111111111111111111112'),
    balance: 1_000n,
    decimals: 9,
    metadata: {
      decimals: 9,
      icon: '',
      id: 'So11111111111111111111111111111111111111112',
      name: 'Solana',
      symbol: 'SOL',
      usdPrice: 1,
    },
    mint: address('So11111111111111111111111111111111111111112'),
  }

  describe('expected behavior', () => {
    it('should enable confirm when simulation succeeds', async () => {
      // ARRANGE
      expect.assertions(1)
      const preparedTransaction = await createPreparedTransaction()

      // ACT
      const result = renderConfirm({
        preparedTransaction,
        simulation: createSimulationResult('success'),
      })

      // ASSERT
      expect(result).not.toContain('disabled=""')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should disable confirm when simulation fails', async () => {
      // ARRANGE
      expect.assertions(2)
      const preparedTransaction = await createPreparedTransaction()

      // ACT
      const result = renderConfirm({
        preparedTransaction,
        simulation: createSimulationResult('failure'),
      })

      // ASSERT
      expect(result).toContain('disabled=""')
      expect(result).toContain('Simulation failed')
    })

    it('should hide stale changes when simulation is loading', async () => {
      // ARRANGE
      expect.assertions(2)
      const preparedTransaction = await createPreparedTransaction()

      // ACT
      const result = renderConfirm({
        isSimulating: true,
        preparedTransaction,
        simulation: createSimulationResult('success', { includeChanges: true }),
      })

      // ASSERT
      expect(result).not.toContain('Expected changes')
      expect(result).toContain('Simulating transaction...')
    })

    it('should hide stale changes when simulation has a transport error', async () => {
      // ARRANGE
      expect.assertions(3)
      const preparedTransaction = await createPreparedTransaction()

      // ACT
      const result = renderConfirm({
        preparedTransaction,
        simulation: createSimulationResult('success', { includeChanges: true, logs: ['Program log: stale'] }),
        simulationError: new Error('rpc failed'),
      })

      // ASSERT
      expect(result).not.toContain('Expected changes')
      expect(result).not.toContain('Program log: stale')
      expect(result).toContain('Simulation failed')
    })
  })

  async function createPreparedTransaction(): Promise<PortfolioPreparedTransaction> {
    const transactionSigner = await generateKeyPairSigner()

    return {
      instructions: [],
      mint,
      recipients: [],
      transactionSigner,
    }
  }

  function createSimulationResult(
    status: SimulatePreparedTransactionResult['status'],
    { includeChanges = false, logs = [] }: { includeChanges?: boolean; logs?: string[] } = {},
  ): SimulatePreparedTransactionResult {
    const base = {
      fee: 5000n,
      latestBlockhash,
      logs,
      solBalanceChanges: includeChanges
        ? [
            {
              address: mint.account,
              change: -5000n,
              postBalance: 95_000n,
              preBalance: 100_000n,
            },
          ]
        : [],
      tokenBalanceChanges: [],
      unitsConsumed: 123n,
    }

    return status === 'success'
      ? {
          ...base,
          error: null,
          status,
        }
      : {
          ...base,
          error: { InstructionError: [0, 'InsufficientFunds'] },
          status,
        }
  }

  function renderConfirm({
    isSimulating = false,
    preparedTransaction,
    simulation,
    simulationError = null,
  }: {
    isSimulating?: boolean
    preparedTransaction: PortfolioPreparedTransaction
    simulation: SimulatePreparedTransactionResult
    simulationError?: Error | null
  }) {
    return renderToStaticMarkup(
      <MemoryRouter>
        <PortfolioUiSendConfirm
          confirm={vi.fn()}
          isLoading={false}
          isPreparing={false}
          isSimulating={isSimulating}
          mint={mint}
          preparedTransaction={preparedTransaction}
          recipients={[]}
          simulation={simulation}
          simulationError={simulationError}
        />
      </MemoryRouter>,
    )
  }
})
