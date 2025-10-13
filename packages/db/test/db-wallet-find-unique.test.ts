import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { WalletInputCreate } from '../src/dto/wallet-input-create'
import type { Wallet } from '../src/entity/wallet'

import { dbWalletCreate } from '../src/db-wallet-create'
import { dbWalletFindUnique } from '../src/db-wallet-find-unique'
import { createDbTest, randomName } from './test-helpers'

const db = createDbTest()

describe('db-wallet-find-unique', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique wallet', async () => {
      // ARRANGE
      expect.assertions(2)
      const input: WalletInputCreate = {
        accountId: crypto.randomUUID(),
        name: randomName('wallet'),
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
      const id = await dbWalletCreate(db, input)

      // ACT
      const item = await dbWalletFindUnique(db, id)

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

    it('should throw an error when finding a unique wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.wallets, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<undefined | Wallet>,
      )

      // ACT & ASSERT
      await expect(dbWalletFindUnique(db, id)).rejects.toThrow(`Error finding wallet with id ${id}`)
    })
  })
})
