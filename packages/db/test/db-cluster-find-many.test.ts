import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbClusterCreate } from '../src/db-cluster-create.ts'
import { dbClusterFindMany } from '../src/db-cluster-find-many.ts'
import type { Cluster } from '../src/entity/cluster.ts'
import { createDbTest, testClusterInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-cluster-find-many', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should find many clusters by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const cluster1 = testClusterInputCreate({ name: 'Test Alpha' })
      const cluster2 = testClusterInputCreate({ name: 'Test Beta' })
      const cluster3 = testClusterInputCreate({ name: 'Another One' })
      await dbClusterCreate(db, cluster1)
      await dbClusterCreate(db, cluster2)
      await dbClusterCreate(db, cluster3)

      // ACT
      const items = await dbClusterFindMany(db, { name: 'Test' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([cluster1.name, cluster2.name]))
    })

    it('should find many clusters by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const cluster1 = testClusterInputCreate()
      const cluster2 = testClusterInputCreate()
      const id1 = await dbClusterCreate(db, cluster1)
      await dbClusterCreate(db, cluster2)

      // ACT
      const items = await dbClusterFindMany(db, { id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.name).toEqual(cluster1.name)
    })

    it('should find many clusters by type', async () => {
      // ARRANGE
      expect.assertions(2)
      const cluster1 = testClusterInputCreate({ type: 'solana:devnet' })
      const cluster2 = testClusterInputCreate({ type: 'solana:mainnet' })
      const cluster3 = testClusterInputCreate({ type: 'solana:devnet' })
      await dbClusterCreate(db, cluster1)
      await dbClusterCreate(db, cluster2)
      await dbClusterCreate(db, cluster3)

      // ACT
      const items = await dbClusterFindMany(db, { type: 'solana:devnet' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([cluster1.name, cluster3.name]))
    })

    it('should find many clusters by a partial endpoint', async () => {
      // ARRANGE
      expect.assertions(2)
      const cluster1 = testClusterInputCreate({ endpoint: 'https://test.com' })
      const cluster2 = testClusterInputCreate({ endpoint: 'https://test.com' })
      const cluster3 = testClusterInputCreate({ endpoint: 'https://some.co' })
      await dbClusterCreate(db, cluster1)
      await dbClusterCreate(db, cluster2)
      await dbClusterCreate(db, cluster3)

      // ACT
      const items = await dbClusterFindMany(db, { endpoint: 'test.com' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([cluster1.name, cluster2.name]))
    })

    it('should find many clusters by a partial name and type', async () => {
      // ARRANGE
      expect.assertions(2)
      const cluster1 = testClusterInputCreate({ name: 'Test Alpha', type: 'solana:devnet' })
      const cluster2 = testClusterInputCreate({ name: 'Test Beta', type: 'solana:mainnet' })
      const cluster3 = testClusterInputCreate({ name: 'Another One', type: 'solana:devnet' })
      await dbClusterCreate(db, cluster1)
      await dbClusterCreate(db, cluster2)
      await dbClusterCreate(db, cluster3)

      // ACT
      const items = await dbClusterFindMany(db, { name: 'Test', type: 'solana:mainnet' })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.name).toBe(cluster2.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding clusters fails', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.spyOn(db.clusters, 'orderBy').mockImplementation(() => ({
        // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
        filter: () => ({
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Cluster[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(dbClusterFindMany(db)).rejects.toThrow('Error finding clusters')
    })
  })
})
