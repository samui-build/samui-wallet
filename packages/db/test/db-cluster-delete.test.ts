import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDbTest, randomName } from './test-helpers'
import { dbClusterCreate, DbClusterCreateInput } from '../src/db-cluster-create'
import { dbClusterFindUnique } from '../src/db-cluster-find-unique'
import { dbClusterDelete } from '../src/db-cluster-delete'

const db = createDbTest()

describe('db-cluster', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should delete a cluster', async () => {
      // ARRANGE
      expect.assertions(1)
      const input: DbClusterCreateInput = {
        name: randomName('cluster'),
        endpoint: 'http://localhost:8899',
        type: 'solana:devnet',
      }
      const id = await dbClusterCreate(db, input)

      // ACT
      await dbClusterDelete(db, id)

      // ASSERT
      const deletedItem = await dbClusterFindUnique(db, id)
      expect(deletedItem).toBeUndefined()
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
