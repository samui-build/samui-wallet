import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbNetworkCreate } from '../src/db-network-create.ts'
import { dbNetworkDelete } from '../src/db-network-delete.ts'
import { dbNetworkFindUnique } from '../src/db-network-find-unique.ts'
import { createDbTest, testNetworkInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-network-delete', () => {
  beforeEach(async () => {
    await db.networks.clear()
  })

  describe('expected behavior', () => {
    it('should delete a network', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testNetworkInputCreate()
      const id = await dbNetworkCreate(db, input)

      // ACT
      await dbNetworkDelete(db, id)

      // ASSERT
      const deletedItem = await dbNetworkFindUnique(db, id)
      expect(deletedItem).toBeNull()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when deleting a network fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.networks, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(dbNetworkDelete(db, id)).rejects.toThrow(`Error deleting network with id ${id}`)
    })
  })
})
