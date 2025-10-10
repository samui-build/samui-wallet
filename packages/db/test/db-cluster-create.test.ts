import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { DbClusterCreateInput } from '../src/db-cluster-create';

import { dbClusterCreate } from '../src/db-cluster-create'
import { dbClusterFindMany } from '../src/db-cluster-find-many'
import { createDbTest, randomName } from './test-helpers'

const db = createDbTest()

describe('db-cluster-create', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should create a cluster', async () => {
      // ARRANGE
      expect.assertions(1)
      const input: DbClusterCreateInput = {
        endpoint: 'http://localhost:8899',
        name: randomName('cluster'),
        type: 'solana:devnet',
      }

      // ACT
      await dbClusterCreate(db, input)

      // ASSERT
      const items = await dbClusterFindMany(db)
      expect(items.map((i) => i.name)).toContain(input.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when creating a cluster fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input: DbClusterCreateInput = {
        endpoint: 'http://localhost:8899',
        name: 'test',
        type: 'solana:devnet',
      }
      vi.spyOn(db.clusters, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbClusterCreate(db, input)).rejects.toThrow('Error creating cluster')
    })
  })
})
