import { describe, expect, it } from 'vitest'

import { createDbTest } from './test-helpers.ts'

const db = createDbTest()

describe('db', () => {
  it('should have the expected tables', () => {
    // ARRANGE
    expect.assertions(1)
    // ACT
    const results = db.tables.map((t) => t.name)
    // ASSERT
    expect(results).toEqual(['accounts', 'bookmarkAccounts', 'bookmarkTransactions', 'networks', 'settings', 'wallets'])
  })
})
