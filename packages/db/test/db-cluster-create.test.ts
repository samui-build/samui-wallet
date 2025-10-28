import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbClusterCreate } from '../src/db-cluster-create'
import { dbClusterFindMany } from '../src/db-cluster-find-many'
import { createDbTest, testClusterInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-cluster-create', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should create a cluster', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testClusterInputCreate()

      // ACT
      await dbClusterCreate(db, input)

      // ASSERT
      const items = await dbClusterFindMany(db)
      expect(items.map((i) => i.name)).toContain(input.name)
    })
    it('should create a cluster with a subscription endpoint', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testClusterInputCreate({ endpointSubscriptions: 'ws://127.0.0.1:8900' })

      // ACT
      await dbClusterCreate(db, input)

      // ASSERT
      const items = await dbClusterFindMany(db)
      expect(items.map((i) => i.endpointSubscriptions)).toContain(input.endpointSubscriptions)
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
      const input = testClusterInputCreate()
      vi.spyOn(db.clusters, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbClusterCreate(db, input)).rejects.toThrow('Error creating cluster')
    })

    it('should throw an error with an invalid endpoint', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testClusterInputCreate({ endpoint: 'not-a-url' })

      // ACT & ASSERT
      await expect(dbClusterCreate(db, input)).rejects.toThrow()
    })
  })
})
