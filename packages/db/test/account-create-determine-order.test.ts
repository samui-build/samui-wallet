import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountCreateDetermineOrder } from '../src/account/account-create-determine-order.ts'
import type { AccountInternal } from '../src/account/account-internal.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('account-create-determine-order', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.settings.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should determine the next account order for a wallet', async () => {
      // ARRANGE
      expect.assertions(3)
      const walletId1 = await walletCreate(db, testWalletCreateInput())
      const walletId2 = await walletCreate(db, testWalletCreateInput())

      // ACT
      const result1 = await accountCreateDetermineOrder(db, walletId1)
      await accountCreate(db, testAccountCreateInput({ walletId: walletId1 }))
      await accountCreate(db, testAccountCreateInput({ walletId: walletId1 }))
      await accountCreate(db, testAccountCreateInput({ walletId: walletId2 }))
      const result2 = await accountCreateDetermineOrder(db, walletId1)
      const result3 = await accountCreateDetermineOrder(db, walletId2)

      // ASSERT
      expect(result1).toBe(0)
      expect(result2).toBe(2)
      expect(result3).toBe(1)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding the last account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.spyOn(db.accounts, 'orderBy').mockImplementation(
        () =>
          ({
            and: () => ({
              last: () => Promise.reject(new Error('Test error')) as PromiseExtended<AccountInternal | undefined>,
            }),
          }) as never,
      )

      // ACT & ASSERT
      await expect(accountCreateDetermineOrder(db, 'wallet-id')).rejects.toThrow('Error finding last account')
    })
  })
})
