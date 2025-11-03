import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbClusterCreate } from '../src/db-cluster-create.ts'
import { dbClusterFindUnique } from '../src/db-cluster-find-unique.ts'
import { dbClusterUpdate } from '../src/db-cluster-update.ts'
import { createDbTest, randomName, testClusterInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-cluster-update', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should update a cluster', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testClusterInputCreate()
      const id = await dbClusterCreate(db, input)
      const newName = randomName('newName')

      // ACT
      await dbClusterUpdate(db, id, { name: newName })

      // ASSERT
      const updatedItem = await dbClusterFindUnique(db, id)
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

    it('should throw an error when updating a cluster fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.clusters, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(dbClusterUpdate(db, id, {})).rejects.toThrow(`Error updating cluster with id ${id}`)
    })
  })
})
