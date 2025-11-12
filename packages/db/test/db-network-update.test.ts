import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbNetworkCreate } from '../src/db-network-create.ts'
import { dbNetworkFindUnique } from '../src/db-network-find-unique.ts'
import { dbNetworkUpdate } from '../src/db-network-update.ts'
import { createDbTest, randomName, testNetworkInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-network-update', () => {
  beforeEach(async () => {
    await db.networks.clear()
  })

  describe('expected behavior', () => {
    it('should update a network', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testNetworkInputCreate()
      const id = await dbNetworkCreate(db, input)
      const newName = randomName('newName')

      // ACT
      await dbNetworkUpdate(db, id, { name: newName })

      // ASSERT
      const updatedItem = await dbNetworkFindUnique(db, id)
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

    it('should throw an error when updating a network fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.networks, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(dbNetworkUpdate(db, id, {})).rejects.toThrow(`Error updating network with id ${id}`)
    })
  })
})
