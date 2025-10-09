import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDbTest, randomName } from './test-helpers'
import { dbWalletCreate, DbWalletCreateInput } from '../src/db-wallet-create'
import { dbWalletFindUnique } from '../src/db-wallet-find-unique'
import { dbWalletUpdate } from '../src/db-wallet-update'

const db = createDbTest()

describe('db-wallet-update', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should update a wallet', async () => {
      // ARRANGE
      expect.assertions(2)
      const input: DbWalletCreateInput = {
        accountId: crypto.randomUUID(),
        name: randomName('wallet'),
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
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
