import { type Address, address, blockhash, generateKeyPairSigner } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTransferInstructionsSol } from '../src/create-transfer-instructions-sol.ts'
import { simulatePreparedTransaction } from '../src/simulate-prepared-transaction.ts'
import type { SolanaClient } from '../src/solana-client.ts'

describe('simulate-prepared-transaction', () => {
  const latestBlockhash = {
    blockhash: blockhash('11111111111111111111111111111111'),
    lastValidBlockHeight: 1n,
  }
  const mint = address('So11111111111111111111111111111111111111113')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('expected behavior', () => {
    it('should normalize a successful simulation result with SOL and token deltas', async () => {
      // ARRANGE
      expect.assertions(11)
      const destination = address('So11111111111111111111111111111111111111112')
      const transactionSigner = await generateKeyPairSigner()
      const simulateTransaction = vi.fn(() => ({
        send: vi.fn(async () => ({
          value: {
            err: null,
            fee: 5000n,
            logs: ['Program success'],
            postBalances: [93_000n, 7_000n, 1n],
            postTokenBalances: [
              {
                accountIndex: 1,
                mint,
                uiTokenAmount: { amount: '10', decimals: 6n },
              },
            ],
            preBalances: [100_000n, 0n, 1n],
            preTokenBalances: [],
            unitsConsumed: 1234n,
          },
        })),
      }))
      const getFeeForMessage = vi.fn(() => ({
        send: vi.fn(async () => ({ value: 7000n })),
      }))
      const getMultipleAccounts = vi.fn(() => ({
        send: vi.fn(async () => ({ value: [] })),
      }))
      const client = {
        rpc: { getFeeForMessage, getMultipleAccounts, simulateTransaction },
        rpcSubscriptions: {},
      } as unknown as SolanaClient
      const instructions = createTransferInstructionsSol({
        recipients: [{ amount: 7_000n, destination }],
        source: transactionSigner,
      })

      // ACT
      const result = await simulatePreparedTransaction(client, {
        instructions,
        latestBlockhash,
        transactionSigner,
      })

      // ASSERT
      expect(simulateTransaction).toHaveBeenCalledWith(expect.any(String), {
        accounts: {
          addresses: expect.arrayContaining([destination, transactionSigner.address]),
          encoding: 'base64',
        },
        commitment: 'confirmed',
        encoding: 'base64',
        innerInstructions: true,
        replaceRecentBlockhash: false,
        sigVerify: false,
      })
      expect(result.error).toBeNull()
      expect(result.fee).toBe(5000n)
      expect(result.latestBlockhash).toBe(latestBlockhash)
      expect(result.logs).toEqual(['Program success'])
      expect(result.solBalanceChanges).toHaveLength(2)
      expect(result.solBalanceChanges).toContainEqual({
        address: destination,
        change: 7_000n,
        postBalance: 7_000n,
        preBalance: 0n,
      })
      expect(result.solBalanceChanges).toContainEqual({
        address: transactionSigner.address,
        change: -7_000n,
        postBalance: 93_000n,
        preBalance: 100_000n,
      })
      expect(result.status).toBe('success')
      expect(result.tokenBalanceChanges).toEqual([
        {
          account: destination,
          change: 10n,
          decimals: 6,
          mint,
          postAmount: 10n,
          preAmount: 0n,
        },
      ])
      expect(result.unitsConsumed).toBe(1234n)
    })

    it('should include closed-account deltas from account fallback', async () => {
      // ARRANGE
      expect.assertions(3)
      const destination = address('So11111111111111111111111111111111111111112')
      const systemProgram = address('11111111111111111111111111111111')
      const tokenProgram = address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      const transactionSigner = await generateKeyPairSigner()
      const sourceAccount = {
        data: ['', 'base64'] as const,
        lamports: 100_000n,
        owner: systemProgram,
      }
      const closedTokenAccount = {
        data: {
          parsed: {
            info: {
              mint,
              owner: transactionSigner.address,
              tokenAmount: {
                amount: '12',
                decimals: 6,
              },
            },
            type: 'account',
          },
          program: 'spl-token',
          space: 165,
        },
        lamports: 2_039_280n,
        owner: tokenProgram,
      }
      const getAccount = (account: Address, state: 'post' | 'pre') => {
        if (account === destination) {
          return state === 'pre' ? closedTokenAccount : null
        }
        if (account === transactionSigner.address) {
          return sourceAccount
        }
        return null
      }
      const getMultipleAccounts = vi.fn((accountAddresses: Address[]) => ({
        send: vi.fn(async () => ({
          value: accountAddresses.map((account) => getAccount(account, 'pre')),
        })),
      }))
      const simulateTransaction = vi.fn(
        (_base64EncodedWireTransaction: string, config: { accounts: { addresses: Address[] } }) => ({
          send: vi.fn(async () => ({
            value: {
              accounts: config.accounts.addresses.map((account) => getAccount(account, 'post')),
              err: null,
              logs: null,
            },
          })),
        }),
      )
      const client = {
        rpc: {
          getFeeForMessage: vi.fn(() => ({
            send: vi.fn(async () => ({ value: null })),
          })),
          getMultipleAccounts,
          simulateTransaction,
        },
        rpcSubscriptions: {},
      } as unknown as SolanaClient
      const instructions = createTransferInstructionsSol({
        recipients: [{ amount: 7_000n, destination }],
        source: transactionSigner,
      })

      // ACT
      const result = await simulatePreparedTransaction(client, {
        instructions,
        latestBlockhash,
        transactionSigner,
      })

      // ASSERT
      expect(result.solBalanceChanges).toEqual([
        {
          address: destination,
          change: -2_039_280n,
          postBalance: 0n,
          preBalance: 2_039_280n,
        },
      ])
      expect(result.status).toBe('success')
      expect(result.tokenBalanceChanges).toEqual([
        {
          account: destination,
          change: -12n,
          decimals: 6,
          mint,
          owner: transactionSigner.address,
          postAmount: 0n,
          preAmount: 12n,
          programId: tokenProgram,
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

    it('should normalize a failed simulation result without throwing', async () => {
      // ARRANGE
      expect.assertions(4)
      const error = { InstructionError: [0, 'InsufficientFunds'] }
      const transactionSigner = await generateKeyPairSigner()
      const client = {
        rpc: {
          getFeeForMessage: vi.fn(() => ({
            send: vi.fn(async () => ({ value: null })),
          })),
          getMultipleAccounts: vi.fn(() => ({
            send: vi.fn(async () => ({ value: [] })),
          })),
          simulateTransaction: vi.fn(() => ({
            send: vi.fn(async () => ({
              value: {
                err: error,
                logs: ['Program failed'],
              },
            })),
          })),
        },
        rpcSubscriptions: {},
      } as unknown as SolanaClient

      // ACT
      const result = await simulatePreparedTransaction(client, {
        instructions: [],
        latestBlockhash,
        transactionSigner,
      })

      // ASSERT
      expect(result.error).toBe(error)
      expect(result.logs).toEqual(['Program failed'])
      expect(result.solBalanceChanges).toEqual([])
      expect(result.status).toBe('failure')
    })

    it('should keep a successful simulation result when enrichment rpc calls fail', async () => {
      // ARRANGE
      expect.assertions(5)
      const transactionSigner = await generateKeyPairSigner()
      const client = {
        rpc: {
          getFeeForMessage: vi.fn(() => ({
            send: vi.fn(async () => {
              throw new Error('fee rpc failed')
            }),
          })),
          getMultipleAccounts: vi.fn(() => ({
            send: vi.fn(async () => {
              throw new Error('accounts rpc failed')
            }),
          })),
          simulateTransaction: vi.fn(() => ({
            send: vi.fn(async () => ({
              value: {
                err: null,
                fee: 5000n,
                logs: ['Program success'],
                postBalances: [99_000n],
                preBalances: [100_000n],
              },
            })),
          })),
        },
        rpcSubscriptions: {},
      } as unknown as SolanaClient

      // ACT
      const result = await simulatePreparedTransaction(client, {
        instructions: [],
        latestBlockhash,
        transactionSigner,
      })

      // ASSERT
      expect(result.error).toBeNull()
      expect(result.fee).toBe(5000n)
      expect(result.logs).toEqual(['Program success'])
      expect(result.solBalanceChanges).toEqual([
        {
          address: transactionSigner.address,
          change: -1000n,
          postBalance: 99_000n,
          preBalance: 100_000n,
        },
      ])
      expect(result.status).toBe('success')
    })
  })
})
