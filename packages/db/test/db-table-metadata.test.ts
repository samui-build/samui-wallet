import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  dbTableMetadata,
  dbTableNames,
  getDbTableMetadata,
  getDbTableRecord,
  getDbTableRecords,
} from '../src/db-table-metadata.ts'
import { networkCreate } from '../src/network/network-create.ts'
import { createAppContextTest, testNetworkCreateInput } from './test-helpers.ts'

const ctx = createAppContextTest()

describe('db-table-metadata', () => {
  beforeEach(async () => {
    await Promise.all(ctx.db.tables.map((table) => table.clear()))
  })

  describe('expected behavior', () => {
    it('should define metadata for every table name', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = dbTableMetadata.map((metadata) => metadata.name)

      // ASSERT
      expect(result).toEqual(dbTableNames)
    })

    it('should get metadata by table name', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = getDbTableMetadata('networks')

      // ASSERT
      expect(result?.name).toBe('networks')
    })

    it('should get a record by table name and id', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testNetworkCreateInput()
      const id = await networkCreate(ctx, input)

      // ACT
      const result = await getDbTableRecord(ctx, 'networks', id)

      // ASSERT
      expect(result?.id).toBe(id)
      expect(result?.['name']).toBe(input.name)
    })

    it('should get records by table name', async () => {
      // ARRANGE
      expect.assertions(2)
      const input1 = testNetworkCreateInput({ name: 'Network 1' })
      const input2 = testNetworkCreateInput({ name: 'Network 2' })
      await networkCreate(ctx, input1)
      await networkCreate(ctx, input2)

      // ACT
      const result = await getDbTableRecords(ctx, 'networks')

      // ASSERT
      expect(result).toHaveLength(2)
      expect(result.map((record) => record['name'])).toEqual(expect.arrayContaining([input1.name, input2.name]))
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return undefined when metadata is not found', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = getDbTableMetadata('unknown')

      // ASSERT
      expect(result).toBeUndefined()
    })
  })
})
