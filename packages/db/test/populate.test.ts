import { env } from '@workspace/env/env'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { populate } from '../src/populate.ts'
import { createDbContextTest } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('populate', () => {
  beforeEach(async () => {
    await Promise.all(ctx.db.tables.map((table) => table.clear()))
  })

  describe('expected behavior', () => {
    it('should populate networks and settings', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      await populate(ctx)
      const result1 = await ctx.db.networks.orderBy('id').toArray()
      const result2 = await ctx.db.settings.orderBy('key').toArray()

      // ASSERT
      expect(result1.map((network) => network.id)).toEqual(['networkDevnet', 'networkLocalnet', 'networkTestnet'])
      expect(result2.map((setting) => [setting.key, setting.value])).toEqual([
        ['activeNetworkId', env('activeNetworkId')],
        ['apiEndpoint', env('apiEndpoint')],
      ])
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when populating duplicate default records', async () => {
      // ARRANGE
      expect.assertions(1)
      await populate(ctx)

      // ACT & ASSERT
      await expect(populate(ctx)).rejects.toThrow()
    })
  })
})
