import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Wallet } from '../src/wallet/wallet.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletReadMnemonic } from '../src/wallet/wallet-read-mnemonic.ts'
import { createDbTest, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('wallet-read-mnemonic', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should read the mnemonic of a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput()
      const id = await walletCreate(db, input)

      // ACT
      const result = await walletReadMnemonic(db, id)

      // ASSERT
      expect(result).toBe(input.mnemonic)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error if the wallet is not found', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'non-existent-id'

      // ACT & ASSERT
      await expect(walletReadMnemonic(db, id)).rejects.toThrow(`Wallet with id ${id} not found`)
    })

    it('should throw an error when reading the mnemonic fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.wallets, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Wallet | undefined>,
      )

      // ACT & ASSERT
      await expect(walletReadMnemonic(db, id)).rejects.toThrow(`Error finding wallet with id ${id}`)
    })
  })
})
