import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbClusterCreate } from '../src/db-cluster-create'
import { dbClusterDelete } from '../src/db-cluster-delete'
import { dbClusterFindUnique } from '../src/db-cluster-find-unique'
import { createDbTest, testClusterInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-cluster-delete', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should delete a cluster', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testClusterInputCreate()
      const id = await dbClusterCreate(db, input)

      // ACT
      await dbClusterDelete(db, id)

      // ASSERT
      const deletedItem = await dbClusterFindUnique(db, id)
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

    it('should throw an error when deleting a cluster fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.clusters, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(dbClusterDelete(db, id)).rejects.toThrow(`Error deleting cluster with id ${id}`)
    })
  })
})
