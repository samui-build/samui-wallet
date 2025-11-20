import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletFindUnique } from '../src/wallet/wallet-find-unique.ts'
import { walletUpdate } from '../src/wallet/wallet-update.ts'
import { createDbTest, randomName, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('wallet-update', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should update a wallet', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testWalletCreateInput()
      const id = await walletCreate(db, input)
      const newName = randomName('newName')

      // ACT
      await walletUpdate(db, id, { name: newName })

      // ASSERT
      const updatedItem = await walletFindUnique(db, id)
      expect(updatedItem).toBeDefined()
      expect(updatedItem?.name).toBe(newName)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when updating a wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.wallets, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(walletUpdate(db, id, {})).rejects.toThrow(`Error updating wallet with id ${id}`)
    })
  })
})
