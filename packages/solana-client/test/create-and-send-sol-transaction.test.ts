/**
 * @vitest-environment node
 */
import { generateKeyPairSigner } from '@solana/kit'
import { beforeEach, describe, expect, it } from 'vitest'
import { createAndSendSolTransaction } from '../src/create-and-send-sol-transaction.ts'
import { createSolanaClient } from '../src/create-solana-client.ts'
import { getBalance } from '../src/get-balance.ts'
import { requestAirdrop } from '../src/request-airdrop.ts'
import type { SolanaClient } from '../src/solana-client.ts'

describe('create-and-send-sol-transaction [integration]', () => {
  let client: SolanaClient

  beforeEach(async () => {
    client = createSolanaClient({
      url: 'http://localhost:8899',
      urlSubscriptions: 'ws://127.0.0.1:8900',
    })
  })

  describe('expected behavior', () => {
    it('should successfully send SOL transaction', async () => {
      // ARRANGE
      expect.assertions(3)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      // Fund sender
      await requestAirdrop({ address: sender.address, amount: 2, client })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const senderBalance = await getBalance(client, { address: sender.address })
      const amount = 500_000_000n // 0.5 SOL

      // ACT
      const signature = await createAndSendSolTransaction(client, {
        amount,
        destination: receiver.address,
        sender,
        senderBalance: senderBalance.value,
      })

      // ASSERT
      expect(signature).toBeDefined()
      expect(typeof signature).toBe('string')
      expect(signature.length).toBeGreaterThan(0)
    })

    it('should send small amount successfully', async () => {
      // ARRANGE
      expect.assertions(4)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      await requestAirdrop({ address: sender.address, amount: 2, client })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const senderBalanceBefore = await getBalance(client, { address: sender.address })
      const amount = 100_000_000n // 0.1 SOL (enough to cover rent exemption)

      // ACT
      const signature = await createAndSendSolTransaction(client, {
        amount,
        destination: receiver.address,
        sender,
        senderBalance: senderBalanceBefore.value,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // ASSERT
      expect(signature).toBeDefined()

      const receiverBalance = await getBalance(client, { address: receiver.address })
      const senderBalanceAfter = await getBalance(client, { address: sender.address })

      expect(receiverBalance.value).toBe(amount)
      expect(senderBalanceAfter.value).toBeLessThan(senderBalanceBefore.value)
      expect(senderBalanceAfter.value).toBe(senderBalanceBefore.value - amount - 5000n)
    })

    it('should send maximum available amount successfully', async () => {
      // ARRANGE
      expect.assertions(3)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      await requestAirdrop({ address: sender.address, amount: 1, client })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const senderBalance = await getBalance(client, { address: sender.address })
      const maxAmount = senderBalance.value - 5000n // Leave room for fee

      // ACT
      const signature = await createAndSendSolTransaction(client, {
        amount: maxAmount,
        destination: receiver.address,
        sender,
        senderBalance: senderBalance.value,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // ASSERT
      expect(signature).toBeDefined()

      const receiverBalance = await getBalance(client, { address: receiver.address })
      const senderBalanceAfter = await getBalance(client, { address: sender.address })

      expect(receiverBalance.value).toBe(maxAmount)
      expect(senderBalanceAfter.value).toBeLessThanOrEqual(5000n)
    })

    it('should handle multiple transactions from same sender', async () => {
      // ARRANGE
      expect.assertions(5)
      const sender = await generateKeyPairSigner()
      const receiver1 = await generateKeyPairSigner()
      const receiver2 = await generateKeyPairSigner()

      await requestAirdrop({ address: sender.address, amount: 2, client })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount1 = 300_000_000n // 0.3 SOL
      const amount2 = 200_000_000n // 0.2 SOL

      // ACT - First transaction
      let senderBalance = await getBalance(client, { address: sender.address })
      const signature1 = await createAndSendSolTransaction(client, {
        amount: amount1,
        destination: receiver1.address,
        sender,
        senderBalance: senderBalance.value,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // ACT - Second transaction
      senderBalance = await getBalance(client, { address: sender.address })
      const signature2 = await createAndSendSolTransaction(client, {
        amount: amount2,
        destination: receiver2.address,
        sender,
        senderBalance: senderBalance.value,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // ASSERT
      expect(signature1).toBeDefined()
      expect(signature2).toBeDefined()
      expect(signature1).not.toBe(signature2)

      const receiver1Balance = await getBalance(client, { address: receiver1.address })
      const receiver2Balance = await getBalance(client, { address: receiver2.address })

      expect(receiver1Balance.value).toBe(amount1)
      expect(receiver2Balance.value).toBe(amount2)
    }, 10000) // 10 second timeout

    it('should verify balance changes correctly after transaction', async () => {
      // ARRANGE
      expect.assertions(3)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      await requestAirdrop({ address: sender.address, amount: 2, client })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const senderBalanceBefore = await getBalance(client, { address: sender.address })
      const amount = 750_000_000n // 0.75 SOL

      // ACT
      await createAndSendSolTransaction(client, {
        amount,
        destination: receiver.address,
        sender,
        senderBalance: senderBalanceBefore.value,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // ASSERT
      const senderBalanceAfter = await getBalance(client, { address: sender.address })
      const receiverBalanceAfter = await getBalance(client, { address: receiver.address })

      expect(receiverBalanceAfter.value).toBe(amount)
      expect(senderBalanceAfter.value).toBeLessThan(senderBalanceBefore.value - amount)
      expect(senderBalanceAfter.value).toBe(senderBalanceBefore.value - amount - 5000n)
    })

    it('should return valid signature format', async () => {
      // ARRANGE
      expect.assertions(2)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      await requestAirdrop({ address: sender.address, amount: 1, client })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const senderBalance = await getBalance(client, { address: sender.address })
      const amount = 100_000_000n // 0.1 SOL

      // ACT
      const signature = await createAndSendSolTransaction(client, {
        amount,
        destination: receiver.address,
        sender,
        senderBalance: senderBalance.value,
      })

      // ASSERT
      expect(typeof signature).toBe('string')
      expect(signature.length).toBeGreaterThan(80) // Base58 signature length
    })
  })

  describe('unexpected behavior', () => {
    it('should throw error when trying to send more SOL than available balance', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      const senderBalance = 500_000_000n
      const amount = 1_000_000_000n

      // ACT & ASSERT
      await expect(
        createAndSendSolTransaction(client, {
          amount,
          destination: receiver.address,
          sender,
          senderBalance,
        }),
      ).rejects.toThrow('Insufficient balance')
    })

    it('should throw error when trying to send entire balance without accounting for fees', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      const senderBalance = 1_000_000_000n
      const amount = senderBalance

      // ACT & ASSERT
      await expect(
        createAndSendSolTransaction(client, {
          amount,
          destination: receiver.address,
          sender,
          senderBalance,
        }),
      ).rejects.toThrow(/Insufficient balance.*Max sendable/)
    })

    it('should throw error when sender has zero balance', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      const senderBalance = 0n
      const amount = 1_000_000_000n

      // ACT & ASSERT
      await expect(
        createAndSendSolTransaction(client, {
          amount,
          destination: receiver.address,
          sender,
          senderBalance,
        }),
      ).rejects.toThrow('Insufficient balance')
    })

    it('should throw error when balance is less than transaction fee', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      const senderBalance = 4000n
      const amount = 1_000n

      // ACT & ASSERT
      await expect(
        createAndSendSolTransaction(client, {
          amount,
          destination: receiver.address,
          sender,
          senderBalance,
        }),
      ).rejects.toThrow('Insufficient balance')
    })

    it('should include detailed balance information in error message', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      const senderBalance = 1_000_000_000n
      const amount = 2_000_000_000n

      // ACT & ASSERT
      await expect(
        createAndSendSolTransaction(client, {
          amount,
          destination: receiver.address,
          sender,
          senderBalance,
        }),
      ).rejects.toThrow(/Available:.*Requested:.*Max sendable/)
    })

    it('should throw error at max sendable boundary', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      const senderBalance = 1_000_000_000n
      const maxSendable = senderBalance - 5000n
      const amount = maxSendable + 1n

      // ACT & ASSERT
      await expect(
        createAndSendSolTransaction(client, {
          amount,
          destination: receiver.address,
          sender,
          senderBalance,
        }),
      ).rejects.toThrow('Insufficient balance')
    })

    it('should throw error when balance equals transaction fee exactly', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      const senderBalance = 5000n
      const amount = 1n

      // ACT & ASSERT
      await expect(
        createAndSendSolTransaction(client, {
          amount,
          destination: receiver.address,
          sender,
          senderBalance,
        }),
      ).rejects.toThrow('Insufficient balance')
    })

    it('should handle invalid RPC connection', async () => {
      // ARRANGE
      expect.assertions(1)
      const badClient = createSolanaClient({ url: 'http://localhost:9999' })
      const sender = await generateKeyPairSigner()
      const receiver = await generateKeyPairSigner()

      // ACT & ASSERT
      await expect(
        createAndSendSolTransaction(badClient, {
          amount: 100_000_000n,
          destination: receiver.address,
          sender,
          senderBalance: 1_000_000_000n,
        }),
      ).rejects.toThrow()
    })
  })
})
