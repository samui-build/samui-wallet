import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { DbClusterCreateInput } from '../src/db-cluster-create';

import { dbClusterCreate } from '../src/db-cluster-create'
import { dbClusterFindUnique } from '../src/db-cluster-find-unique'
import { dbClusterUpdate } from '../src/db-cluster-update'
import { createDbTest, randomName } from './test-helpers'

const db = createDbTest()

describe('db-cluster', () => {
  beforeEach(async () => {
    await db.clusters.clear()
  })

  describe('expected behavior', () => {
    it('should update a cluster', async () => {
      // ARRANGE
      expect.assertions(2)
      const input: DbClusterCreateInput = {
        endpoint: 'http://localhost:8899',
        name: randomName('cluster'),
        type: 'solana:devnet',
      }
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
