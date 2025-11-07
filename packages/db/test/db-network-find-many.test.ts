import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbNetworkCreate } from '../src/db-network-create.ts'
import { dbNetworkFindMany } from '../src/db-network-find-many.ts'
import type { Network } from '../src/entity/network.ts'
import { createDbTest, testNetworkInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-network-find-many', () => {
  beforeEach(async () => {
    await db.networks.clear()
  })

  describe('expected behavior', () => {
    it('should find many networks by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkInputCreate({ name: 'Test Alpha' })
      const network2 = testNetworkInputCreate({ name: 'Test Beta' })
      const network3 = testNetworkInputCreate({ name: 'Another One' })
      await dbNetworkCreate(db, network1)
      await dbNetworkCreate(db, network2)
      await dbNetworkCreate(db, network3)

      // ACT
      const items = await dbNetworkFindMany(db, { name: 'Test' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([network1.name, network2.name]))
    })

    it('should find many networks by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkInputCreate()
      const network2 = testNetworkInputCreate()
      const id1 = await dbNetworkCreate(db, network1)
      await dbNetworkCreate(db, network2)

      // ACT
      const items = await dbNetworkFindMany(db, { id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.name).toEqual(network1.name)
    })

    it('should find many networks by type', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkInputCreate({ type: 'solana:devnet' })
      const network2 = testNetworkInputCreate({ type: 'solana:mainnet' })
      const network3 = testNetworkInputCreate({ type: 'solana:devnet' })
      await dbNetworkCreate(db, network1)
      await dbNetworkCreate(db, network2)
      await dbNetworkCreate(db, network3)

      // ACT
      const items = await dbNetworkFindMany(db, { type: 'solana:devnet' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([network1.name, network3.name]))
    })

    it('should find many networks by a partial endpoint', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkInputCreate({ endpoint: 'https://test.com' })
      const network2 = testNetworkInputCreate({ endpoint: 'https://test.com' })
      const network3 = testNetworkInputCreate({ endpoint: 'https://some.co' })
      await dbNetworkCreate(db, network1)
      await dbNetworkCreate(db, network2)
      await dbNetworkCreate(db, network3)

      // ACT
      const items = await dbNetworkFindMany(db, { endpoint: 'test.com' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([network1.name, network2.name]))
    })

    it('should find many networks by a partial name and type', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkInputCreate({ name: 'Test Alpha', type: 'solana:devnet' })
      const network2 = testNetworkInputCreate({ name: 'Test Beta', type: 'solana:mainnet' })
      const network3 = testNetworkInputCreate({ name: 'Another One', type: 'solana:devnet' })
      await dbNetworkCreate(db, network1)
      await dbNetworkCreate(db, network2)
      await dbNetworkCreate(db, network3)

      // ACT
      const items = await dbNetworkFindMany(db, { name: 'Test', type: 'solana:mainnet' })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.name).toBe(network2.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding networks fails', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.spyOn(db.networks, 'orderBy').mockImplementation(() => ({
        // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
        filter: () => ({
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Network[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(dbNetworkFindMany(db)).rejects.toThrow('Error finding networks')
    })
  })
})
