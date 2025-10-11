import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { DbClusterCreateInput } from '../src/db-cluster-create'
import type { Cluster } from '../src/entity/cluster'

import { dbClusterCreate } from '../src/db-cluster-create'
import { dbClusterFindMany } from '../src/db-cluster-find-many'
import { createDbTest } from './test-helpers'

const db = createDbTest()

describe('db-cluster', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should find many clusters by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const cluster1: DbClusterCreateInput = { endpoint: 'ep1', name: 'Test Cluster Alpha', type: 'solana:devnet' }
      const cluster2: DbClusterCreateInput = { endpoint: 'ep2', name: 'Test Cluster Beta', type: 'solana:devnet' }
      const cluster3: DbClusterCreateInput = { endpoint: 'ep3', name: 'Another One', type: 'solana:devnet' }
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
      const cluster1: DbClusterCreateInput = { endpoint: 'ep1', name: 'Test Cluster Alpha', type: 'solana:devnet' }
      const cluster2: DbClusterCreateInput = { endpoint: 'ep2', name: 'Test Cluster Beta', type: 'solana:mainnet' }
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
      const cluster1: DbClusterCreateInput = { endpoint: 'ep1', name: 'Test Cluster Alpha', type: 'solana:devnet' }
      const cluster2: DbClusterCreateInput = { endpoint: 'ep2', name: 'Test Cluster Beta', type: 'solana:mainnet' }
      const cluster3: DbClusterCreateInput = { endpoint: 'ep3', name: 'Another One', type: 'solana:devnet' }
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
        endpoint: 'http://test.com',
        name: 'Test Cluster Alpha',
        type: 'solana:devnet',
      }
      const cluster2: DbClusterCreateInput = {
        endpoint: 'http://test.com',
        name: 'Test Cluster Beta',
        type: 'solana:devnet',
      }
      const cluster3: DbClusterCreateInput = {
        endpoint: 'http://another.com',
        name: 'Another One',
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
      const cluster1: DbClusterCreateInput = { endpoint: 'ep1', name: 'Test Cluster Alpha', type: 'solana:devnet' }
      const cluster2: DbClusterCreateInput = { endpoint: 'ep2', name: 'Test Cluster Beta', type: 'solana:mainnet' }
      const cluster3: DbClusterCreateInput = { endpoint: 'ep3', name: 'Another One', type: 'solana:devnet' }
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
