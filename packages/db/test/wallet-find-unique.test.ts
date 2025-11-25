import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Wallet } from '../src/wallet/wallet.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletFindUnique } from '../src/wallet/wallet-find-unique.ts'
import { createDbTest, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('wallet-find-unique', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique wallet', async () => {
      // ARRANGE
      expect.assertions(3)
      const input = testWalletCreateInput()
      const id = await walletCreate(db, input)

      // ACT
      const item = await walletFindUnique(db, id)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.name).toBe(input.name)
      // @ts-expect-error mnemonic does not exist on the type. Here we ensure it's sanitized.
      expect(item?.mnemonic).toBe(undefined)
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
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Wallet | undefined>,
      )

      // ACT & ASSERT
      await expect(walletFindUnique(db, id)).rejects.toThrow(`Error finding wallet with id ${id}`)
    })
  })
})
