import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { WalletInputCreate } from '../src/dto/wallet-input-create'

import { dbWalletCreate } from '../src/db-wallet-create'
import { dbWalletFindMany } from '../src/db-wallet-find-many'
import { createDbTest, randomName } from './test-helpers'

const db = createDbTest()

describe('db-wallet-create', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should create a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const accountId = crypto.randomUUID()
      const input: WalletInputCreate = {
        accountId,
        name: randomName('wallet'),
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }

      // ACT
      await dbWalletCreate(db, input)

      // ASSERT
      const items = await dbWalletFindMany(db, { accountId })
      expect(items.map((i) => i.name)).toContain(input.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when creating a wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input: WalletInputCreate = {
        accountId: 'test-account',
        name: 'test',
        publicKey: 'test-pk',
        type: 'Derived',
      }
      vi.spyOn(db.wallets, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbWalletCreate(db, input)).rejects.toThrow('Error creating wallet')
    })
  })
})
