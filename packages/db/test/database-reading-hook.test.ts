import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import type { AccountInternal } from '../src/account/account-internal.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import type { WalletInternal } from '../src/wallet/wallet-internal.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('database-reading-hook', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.settings.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should read account secret keys from raw account queries', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = await walletCreate(db, testWalletCreateInput())
      const input = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const id = await accountCreate(db, input)

      // ACT
      const result = (await db.accounts.where('id').equals(id).raw().first()) as AccountInternal | undefined

      // ASSERT
      expect(result?.secretKey).toBe(input.secretKey)
    })

    it('should read wallet mnemonics from raw wallet queries', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput({ mnemonic: 'test mnemonic' })
      const id = await walletCreate(db, input)

      // ACT
      const result = (await db.wallets.where('id').equals(id).raw().first()) as WalletInternal | undefined

      // ASSERT
      expect(result?.mnemonic).toBe(input.mnemonic)
    })

    it('should sanitize account secret keys from default reads', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = await walletCreate(db, testWalletCreateInput())
      const input = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const id = await accountCreate(db, input)

      // ACT
      const result = await db.accounts.get(id)

      // ASSERT
      expect(result).toBeDefined()
      expect(result).not.toHaveProperty('secretKey')
    })

    it('should sanitize wallet mnemonics from default reads', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testWalletCreateInput({ mnemonic: 'test mnemonic' })
      const id = await walletCreate(db, input)

      // ACT
      const result = await db.wallets.get(id)

      // ASSERT
      expect(result).toBeDefined()
      expect(result).not.toHaveProperty('mnemonic')
    })

    it('should sanitize wallet and account secrets from collection reads', async () => {
      // ARRANGE
      expect.assertions(4)
      const walletId = await walletCreate(db, testWalletCreateInput({ mnemonic: 'test mnemonic' }))
      await walletCreate(db, testWalletCreateInput({ mnemonic: 'other mnemonic' }))
      await accountCreate(db, testAccountCreateInput({ secretKey: 'test-secret-key-1', walletId }))
      await accountCreate(db, testAccountCreateInput({ secretKey: 'test-secret-key-2', walletId }))

      // ACT
      const dataWallets = await db.wallets
        .orderBy('order')
        .filter((wallet) => wallet.id === walletId)
        .toArray()
      const dataAccounts = await db.accounts
        .orderBy('order')
        .filter((account) => account.walletId === walletId)
        .toArray()
      const result = dataWallets.map((wallet) => ({
        ...wallet,
        accounts: dataAccounts.filter((account) => account.walletId === wallet.id),
      }))

      // ASSERT
      expect(result).toHaveLength(1)
      expect(result[0]).not.toHaveProperty('mnemonic')
      expect(result[0]?.accounts).toHaveLength(2)
      expect(result[0]?.accounts.every((account) => !('secretKey' in account))).toBe(true)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return undefined when reading a missing account', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'missing-account-id'

      // ACT
      const result = await db.accounts.get(id)

      // ASSERT
      expect(result).toBeUndefined()
    })

    it('should return undefined when reading a missing wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'missing-wallet-id'

      // ACT
      const result = await db.wallets.get(id)

      // ASSERT
      expect(result).toBeUndefined()
    })
  })
})
