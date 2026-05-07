import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Network } from '../src/network/network.ts'
import { networkCreate } from '../src/network/network-create.ts'
import { networkFindMany } from '../src/network/network-find-many.ts'
import { createAppContextTest, testNetworkCreateInput } from './test-helpers.ts'

const ctx = createAppContextTest()

describe('network-find-many', () => {
  beforeEach(async () => {
    await ctx.db.networks.clear()
  })

  describe('expected behavior', () => {
    it('should find many networks by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkCreateInput({ name: 'Test Alpha' })
      const network2 = testNetworkCreateInput({ name: 'Test Beta' })
      const network3 = testNetworkCreateInput({ name: 'Another One' })
      await networkCreate(ctx, network1)
      await networkCreate(ctx, network2)
      await networkCreate(ctx, network3)

      // ACT
      const items = await networkFindMany(ctx, { name: 'Test' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([network1.name, network2.name]))
    })

    it('should find many networks by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkCreateInput()
      const network2 = testNetworkCreateInput()
      const id1 = await networkCreate(ctx, network1)
      await networkCreate(ctx, network2)

      // ACT
      const items = await networkFindMany(ctx, { id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.name).toEqual(network1.name)
    })

    it('should find many networks by type', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkCreateInput({ type: 'solana:devnet' })
      const network2 = testNetworkCreateInput({ type: 'solana:mainnet' })
      const network3 = testNetworkCreateInput({ type: 'solana:devnet' })
      await networkCreate(ctx, network1)
      await networkCreate(ctx, network2)
      await networkCreate(ctx, network3)

      // ACT
      const items = await networkFindMany(ctx, { type: 'solana:devnet' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([network1.name, network3.name]))
    })

    it('should find many networks by a partial endpoint', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkCreateInput({ endpoint: 'https://test.com' })
      const network2 = testNetworkCreateInput({ endpoint: 'https://test.com' })
      const network3 = testNetworkCreateInput({ endpoint: 'https://some.co' })
      await networkCreate(ctx, network1)
      await networkCreate(ctx, network2)
      await networkCreate(ctx, network3)

      // ACT
      const items = await networkFindMany(ctx, { endpoint: 'test.com' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([network1.name, network2.name]))
    })

    it('should find many networks by a partial name and type', async () => {
      // ARRANGE
      expect.assertions(2)
      const network1 = testNetworkCreateInput({ name: 'Test Alpha', type: 'solana:devnet' })
      const network2 = testNetworkCreateInput({ name: 'Test Beta', type: 'solana:mainnet' })
      const network3 = testNetworkCreateInput({ name: 'Another One', type: 'solana:devnet' })
      await networkCreate(ctx, network1)
      await networkCreate(ctx, network2)
      await networkCreate(ctx, network3)

      // ACT
      const items = await networkFindMany(ctx, { name: 'Test', type: 'solana:mainnet' })

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
      vi.spyOn(ctx.db.networks, 'orderBy').mockImplementation(() => ({
        // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
        filter: () => ({
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Network[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(networkFindMany(ctx)).rejects.toThrow('Error finding networks')
    })
  })
})
