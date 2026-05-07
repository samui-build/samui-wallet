import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDb } from '../src/create-db.ts'
import { Database } from '../src/database.ts'
import { randomName } from './test-helpers.ts'

describe('create-db', () => {
  describe('expected behavior', () => {
    it('should create a database with the configured name', () => {
      // ARRANGE
      expect.assertions(2)
      const name = 'create-db-test'

      // ACT
      const result = createDb({ name })

      // ASSERT
      expect(result).toBeInstanceOf(Database)
      expect(result.name).toBe(name)
    })

    it('should have the expected tables', () => {
      // ARRANGE
      expect.assertions(1)
      const db = createDb({ name: randomName('text') })
      // ACT
      const results = db.tables.map((t) => t.name)
      // ASSERT
      expect(results).toEqual([
        'accounts',
        'bookmarkAccounts',
        'bookmarkTransactions',
        'networks',
        'settings',
        'wallets',
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

    it('should create a database with an empty name', () => {
      // ARRANGE
      expect.assertions(1)
      const name = ''

      // ACT
      const result = createDb({ name })

      // ASSERT
      expect(result.name).toBe(name)
    })
  })
})
