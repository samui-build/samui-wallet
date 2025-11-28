import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Account } from '../src/account/account.ts'
import { accountCreate } from '../src/account/account-create.ts'
import { accountReadSecretKey } from '../src/account/account-read-secret-key.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('account-read-secret-key', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should read the secret key of an account', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletInput = testWalletCreateInput()
      const walletId = await walletCreate(db, walletInput)
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const id = await accountCreate(db, accountInput)

      // ACT
      const result = await accountReadSecretKey(db, id)

      // ASSERT
      expect(result).toBe(accountInput.secretKey)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error if the account is not found', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'non-existent-id'

      // ACT & ASSERT
      await expect(accountReadSecretKey(db, id)).rejects.toThrow(`Account with id ${id} not found`)
    })

    it('should throw an error if the account is of type Watched', async () => {
      // ARRANGE
      const walletInput = testWalletCreateInput()
      const walletId = await walletCreate(db, walletInput)
      const accountInput = testAccountCreateInput({ type: 'Watched', walletId })
      const id = await accountCreate(db, accountInput)

      // ACT & ASSERT
      await expect(accountReadSecretKey(db, id)).rejects.toThrow(`Account with id ${id} does not have a secret key`)
    })

    it('should throw an error when reading the secret key fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.accounts, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Account | undefined>,
      )

      // ACT & ASSERT
      await expect(accountReadSecretKey(db, id)).rejects.toThrow(`Error finding account with id ${id}`)
    })
  })
})
