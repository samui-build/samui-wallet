import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbWalletCreate } from '../src/db-wallet-create.ts'
import { dbWalletFindUnique } from '../src/db-wallet-find-unique.ts'
import { dbWalletUpdate } from '../src/db-wallet-update.ts'
import { createDbTest, randomName, testWalletInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-wallet-update', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should update a wallet', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testWalletInputCreate({ accountId: crypto.randomUUID(), name: randomName('wallet') })
      const id = await dbWalletCreate(db, input)
      const newName = randomName('newName')

      // ACT
      await dbWalletUpdate(db, id, { name: newName })

      // ASSERT
      const updatedItem = await dbWalletFindUnique(db, id)
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
      await expect(dbWalletUpdate(db, id, {})).rejects.toThrow(`Error updating wallet with id ${id}`)
    })
  })
})
