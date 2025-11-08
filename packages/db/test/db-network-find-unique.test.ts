import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbNetworkCreate } from '../src/db-network-create.ts'
import { dbNetworkFindUnique } from '../src/db-network-find-unique.ts'
import type { Network } from '../src/entity/network.ts'
import { createDbTest, testNetworkInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-network-find-unique', () => {
  beforeEach(async () => {
    await db.networks.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique network', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testNetworkInputCreate()
      const id = await dbNetworkCreate(db, input)

      // ACT
      const item = await dbNetworkFindUnique(db, id)

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

    it('should throw an error when finding a unique network fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.networks, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Network | undefined>,
      )

      // ACT & ASSERT
      await expect(dbNetworkFindUnique(db, id)).rejects.toThrow(`Error finding network with id ${id}`)
    })
  })
})
