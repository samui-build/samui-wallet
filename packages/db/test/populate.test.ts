import { env } from '@workspace/env/env'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { populate } from '../src/populate.ts'
import { createDbTest } from './test-helpers.ts'

const db = createDbTest()

describe('populate', () => {
  beforeEach(async () => {
    await Promise.all(db.tables.map((table) => table.clear()))
  })

  describe('expected behavior', () => {
    it('should populate networks and settings', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      await populate(db)
      const result1 = await db.networks.orderBy('id').toArray()
      const result2 = await db.settings.orderBy('key').toArray()

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
      await populate(db)

      // ACT & ASSERT
      await expect(populate(db)).rejects.toThrow()
    })
  })
})
