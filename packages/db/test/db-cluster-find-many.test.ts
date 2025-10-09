import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDbTest } from './test-helpers'
import { dbClusterCreate, DbClusterCreateInput } from '../src/db-cluster-create'
import { dbClusterFindMany } from '../src/db-cluster-find-many'
import { Cluster } from '../src/entity/cluster'

const db = createDbTest()

describe('db-cluster', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should find many clusters by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const cluster1: DbClusterCreateInput = { name: 'Test Cluster Alpha', endpoint: 'ep1', type: 'solana:devnet' }
      const cluster2: DbClusterCreateInput = { name: 'Test Cluster Beta', endpoint: 'ep2', type: 'solana:devnet' }
      const cluster3: DbClusterCreateInput = { name: 'Another One', endpoint: 'ep3', type: 'solana:devnet' }
      await dbClusterCreate(db, cluster1)
      await dbClusterCreate(db, cluster2)
      await dbClusterCreate(db, cluster3)

      // ACT
      const items = await dbClusterFindMany(db, { name: 'Test Cluster' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([cluster1.name, cluster2.name]))
    })

    it('should find many clusters by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const cluster1: DbClusterCreateInput = { name: 'Test Cluster Alpha', endpoint: 'ep1', type: 'solana:devnet' }
      const cluster2: DbClusterCreateInput = { name: 'Test Cluster Beta', endpoint: 'ep2', type: 'solana:mainnet' }
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
      const cluster1: DbClusterCreateInput = { name: 'Test Cluster Alpha', endpoint: 'ep1', type: 'solana:devnet' }
      const cluster2: DbClusterCreateInput = { name: 'Test Cluster Beta', endpoint: 'ep2', type: 'solana:mainnet' }
      const cluster3: DbClusterCreateInput = { name: 'Another One', endpoint: 'ep3', type: 'solana:devnet' }
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
      const cluster1: DbClusterCreateInput = {
        name: 'Test Cluster Alpha',
        endpoint: 'http://test.com',
        type: 'solana:devnet',
      }
      const cluster2: DbClusterCreateInput = {
        name: 'Test Cluster Beta',
        endpoint: 'http://test.com',
        type: 'solana:devnet',
      }
      const cluster3: DbClusterCreateInput = {
        name: 'Another One',
        endpoint: 'http://another.com',
        type: 'solana:devnet',
      }
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
      const cluster1: DbClusterCreateInput = { name: 'Test Cluster Alpha', endpoint: 'ep1', type: 'solana:devnet' }
      const cluster2: DbClusterCreateInput = { name: 'Test Cluster Beta', endpoint: 'ep2', type: 'solana:mainnet' }
      const cluster3: DbClusterCreateInput = { name: 'Another One', endpoint: 'ep3', type: 'solana:devnet' }
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
      vi.spyOn(db.clusters, 'toArray').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Cluster[]>,
      )

      // ACT & ASSERT
      await expect(dbClusterFindMany(db)).rejects.toThrow('Error finding clusters')
    })
  })
})
