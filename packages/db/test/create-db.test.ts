import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDb } from '../src/create-db.ts'
import { Database } from '../src/database.ts'

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
