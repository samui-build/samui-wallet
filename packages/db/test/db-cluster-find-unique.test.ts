import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDbTest, randomName } from './test-helpers'
import { dbClusterCreate, DbClusterCreateInput } from '../src/db-cluster-create'
import { dbClusterFindUnique } from '../src/db-cluster-find-unique'
import { Cluster } from '../src/entity/cluster'

const db = createDbTest()

describe('db-cluster', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique cluster', async () => {
      // ARRANGE
      expect.assertions(2)
      const input: DbClusterCreateInput = {
        name: randomName('cluster'),
        endpoint: 'http://localhost:8899',
        type: 'solana:devnet',
      }
      const id = await dbClusterCreate(db, input)

      // ACT
      const item = await dbClusterFindUnique(db, id)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.name).toBe(input.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding a unique cluster fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.clusters, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Cluster | undefined>,
      )

      // ACT & ASSERT
      await expect(dbClusterFindUnique(db, id)).rejects.toThrow(`Error finding cluster with id ${id}`)
    })
  })
})
