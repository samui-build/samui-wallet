import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountReadSecretKey } from '../src/account/account-read-secret-key.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletReadMnemonic } from '../src/wallet/wallet-read-mnemonic.ts'
import { walletReprotect } from '../src/wallet/wallet-reprotect.ts'
import {
  createDbContextTest,
  createPasswordTestVault,
  testAccountCreateInput,
  testWalletCreateInput,
} from './test-helpers.ts'

const ctx = createDbContextTest()

describe('wallet-reprotect', () => {
  beforeEach(async () => {
    await ctx.db.accounts.clear()
    await ctx.db.wallets.clear()
    await createPasswordTestVault(ctx)
  })

  describe('expected behavior', () => {
    it('should reprotect a password wallet to unsecured', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletInput = testWalletCreateInput({ mnemonic: 'test mnemonic' })
      const walletId = await walletCreate(ctx, walletInput)
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const accountId = await accountCreate(ctx, accountInput)

      // ACT
      await walletReprotect(ctx, { protection: { mode: 'unsecured' }, walletId })
      ctx.vault.lock()
      const result1 = await walletReadMnemonic(ctx, walletId)
      const result2 = await accountReadSecretKey(ctx, accountId)

      // ASSERT
      expect(result1).toBe(walletInput.mnemonic)
      expect(result2).toBe(accountInput.secretKey)
    })

    it('should reprotect a password wallet to PIN', async () => {
      // ARRANGE
      expect.assertions(3)
      const walletInput = testWalletCreateInput({ mnemonic: 'test mnemonic' })
      const walletId = await walletCreate(ctx, walletInput)
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const accountId = await accountCreate(ctx, accountInput)

      // ACT
      await walletReprotect(ctx, { protection: { mode: 'pin', pin: '1234' }, walletId })
      ctx.vault.lock()

      // ASSERT
      await expect(walletReadMnemonic(ctx, walletId)).rejects.toThrow('Wallet is locked')
      await ctx.vault.unlockWallet({ credential: '1234', walletId })
      expect(await walletReadMnemonic(ctx, walletId)).toBe(walletInput.mnemonic)
      expect(await accountReadSecretKey(ctx, accountId)).toBe(accountInput.secretKey)
    })

    it('should reprotect an unlocked PIN wallet to password', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletInput = testWalletCreateInput({ mnemonic: 'test mnemonic', protection: { mode: 'pin', pin: '1234' } })
      const walletId = await walletCreate(ctx, walletInput)
      await ctx.vault.unlockWallet({ credential: '1234', walletId })
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const accountId = await accountCreate(ctx, accountInput)

      // ACT
      await walletReprotect(ctx, { protection: { mode: 'password' }, walletId })

      // ASSERT
      expect(await walletReadMnemonic(ctx, walletId)).toBe(walletInput.mnemonic)
      expect(await accountReadSecretKey(ctx, accountId)).toBe(accountInput.secretKey)
    })

    it('should clear the cached PIN key after a PIN wallet changes to unsecured', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletInput = testWalletCreateInput({ mnemonic: 'test mnemonic', protection: { mode: 'pin', pin: '1234' } })
      const walletId = await walletCreate(ctx, walletInput)
      await ctx.vault.unlockWallet({ credential: '1234', walletId })
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const accountId = await accountCreate(ctx, accountInput)

      // ACT
      await walletReprotect(ctx, { protection: { mode: 'unsecured' }, walletId })
      const result1 = await walletReadMnemonic(ctx, walletId)
      const result2 = await accountReadSecretKey(ctx, accountId)

      // ASSERT
      expect(result1).toBe(walletInput.mnemonic)
      expect(result2).toBe(accountInput.secretKey)
    })

    it('should require unlock after an unlocked PIN wallet changes to a new PIN', async () => {
      // ARRANGE
      expect.assertions(4)
      const walletInput = testWalletCreateInput({ mnemonic: 'test mnemonic', protection: { mode: 'pin', pin: '1234' } })
      const walletId = await walletCreate(ctx, walletInput)
      await ctx.vault.unlockWallet({ credential: '1234', walletId })
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const accountId = await accountCreate(ctx, accountInput)

      // ACT
      await walletReprotect(ctx, { protection: { mode: 'pin', pin: '5678' }, walletId })

      // ASSERT
      await expect(walletReadMnemonic(ctx, walletId)).rejects.toThrow('Wallet is locked')
      await expect(ctx.vault.unlockWallet({ credential: '1234', walletId })).rejects.toThrow('Unable to unlock wallet')
      await ctx.vault.unlockWallet({ credential: '5678', walletId })
      expect(await walletReadMnemonic(ctx, walletId)).toBe(walletInput.mnemonic)
      expect(await accountReadSecretKey(ctx, accountId)).toBe(accountInput.secretKey)
    })

    it('should require unlock after an unsecured wallet changes to PIN', async () => {
      // ARRANGE
      expect.assertions(3)
      const walletInput = testWalletCreateInput({ mnemonic: 'test mnemonic', protection: { mode: 'unsecured' } })
      const walletId = await walletCreate(ctx, walletInput)
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const accountId = await accountCreate(ctx, accountInput)

      // ACT
      await walletReprotect(ctx, { protection: { mode: 'pin', pin: '1234' }, walletId })

      // ASSERT
      await expect(walletReadMnemonic(ctx, walletId)).rejects.toThrow('Wallet is locked')
      await ctx.vault.unlockWallet({ credential: '1234', walletId })
      expect(await walletReadMnemonic(ctx, walletId)).toBe(walletInput.mnemonic)
      expect(await accountReadSecretKey(ctx, accountId)).toBe(accountInput.secretKey)
    })

    it('should keep other password wallets protected when one wallet becomes unsecured', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId1 = await walletCreate(ctx, testWalletCreateInput({ mnemonic: 'test mnemonic 1' }))
      const walletId2 = await walletCreate(ctx, testWalletCreateInput({ mnemonic: 'test mnemonic 2' }))

      // ACT
      await walletReprotect(ctx, { protection: { mode: 'unsecured' }, walletId: walletId1 })
      ctx.vault.lock()
      const result = await walletReadMnemonic(ctx, walletId1)

      // ASSERT
      expect(result).toBe('test mnemonic 1')
      await expect(walletReadMnemonic(ctx, walletId2)).rejects.toThrow('Vault is locked')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when the current wallet key cannot be resolved', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = await walletCreate(ctx, testWalletCreateInput({ protection: { mode: 'pin', pin: '1234' } }))

      // ACT & ASSERT
      await expect(walletReprotect(ctx, { protection: { mode: 'unsecured' }, walletId })).rejects.toThrow(
        'Wallet is locked',
      )
    })

    it('should throw an error when the target PIN is invalid', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = await walletCreate(ctx, testWalletCreateInput())

      // ACT & ASSERT
      await expect(walletReprotect(ctx, { protection: { mode: 'pin', pin: '123' }, walletId })).rejects.toThrow(
        'PIN must be at least 4 digits',
      )
    })
  })
})
