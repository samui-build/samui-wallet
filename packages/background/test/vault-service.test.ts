import type { AppContext } from '@workspace/context/app-context'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getVaultRuntimeService, registerVaultRuntimeService } from '../src/services/vault.ts'

const mocks = vi.hoisted(() => {
  const appContext = {
    db: {},
    vault: {
      isConfigured: vi.fn(),
      isUnlocked: vi.fn(),
      lock: vi.fn(),
      requireWalletKey: vi.fn(),
      unlock: vi.fn(),
      unlockWallet: vi.fn(),
    },
  }

  return {
    accountFindUnique: vi.fn(),
    appContext,
    createProxyService: vi.fn(),
    registerService: vi.fn(),
    settingFindUnique: vi.fn(),
    walletFindUnique: vi.fn(),
  }
})

vi.mock('@webext-core/proxy-service', () => ({
  createProxyService: mocks.createProxyService,
  registerService: mocks.registerService,
}))

vi.mock('@workspace/db/account/account-find-unique', () => ({
  accountFindUnique: mocks.accountFindUnique,
}))

vi.mock('@workspace/db/setting/setting-find-unique', () => ({
  settingFindUnique: mocks.settingFindUnique,
}))

vi.mock('@workspace/db/wallet/wallet-find-unique', () => ({
  walletFindUnique: mocks.walletFindUnique,
}))

const account = {
  id: 'account-id',
  publicKey: 'public-key',
  walletId: 'wallet-id',
}
const credential = '1234'
const appContext = mocks.appContext as unknown as AppContext
const wallet = {
  id: account.walletId,
  protectionMode: 'pin',
}

describe('vault-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.accountFindUnique.mockResolvedValue(account)
    mocks.appContext.vault.isConfigured.mockResolvedValue(true)
    mocks.appContext.vault.isUnlocked.mockReturnValue(false)
    mocks.appContext.vault.requireWalletKey.mockResolvedValue({ id: 'wallet-key' })
    mocks.appContext.vault.unlock.mockResolvedValue(undefined)
    mocks.appContext.vault.unlockWallet.mockResolvedValue(undefined)
    mocks.settingFindUnique.mockResolvedValue({ value: account.id })
    mocks.walletFindUnique.mockResolvedValue(wallet)
  })

  describe('expected behavior', () => {
    it('should return a proxy service when the local service is not registered', () => {
      // ARRANGE
      expect.assertions(2)
      const proxyService = { id: 'proxy-service' }
      mocks.createProxyService.mockReturnValue(proxyService)

      // ACT
      const result = getVaultRuntimeService()

      // ASSERT
      expect(mocks.createProxyService).toHaveBeenCalledTimes(1)
      expect(result).toBe(proxyService)
    })

    it('should register the vault runtime service', () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result = registerVaultRuntimeService(appContext)

      // ASSERT
      expect(mocks.registerService).toHaveBeenCalledTimes(1)
      expect(result).toBeDefined()
    })

    it('should return the active wallet protection mode', async () => {
      // ARRANGE
      expect.assertions(3)
      const service = registerVaultRuntimeService(appContext)

      // ACT
      const result = await service.activeWalletProtectionMode()

      // ASSERT
      expect(mocks.accountFindUnique).toHaveBeenCalledWith(mocks.appContext, account.id)
      expect(mocks.walletFindUnique).toHaveBeenCalledWith(mocks.appContext, account.walletId)
      expect(result).toBe('pin')
    })

    it('should fall back to password when there is no active wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      mocks.settingFindUnique.mockResolvedValue(undefined)
      const service = registerVaultRuntimeService(appContext)

      // ACT
      const result = await service.activeWalletProtectionMode()

      // ASSERT
      expect(result).toBe('password')
    })

    it('should report active wallet unlock status from requireWalletKey', async () => {
      // ARRANGE
      expect.assertions(3)
      const service = registerVaultRuntimeService(appContext)

      // ACT
      const result = await service.isActiveWalletUnlocked()

      // ASSERT
      expect(mocks.appContext.vault.requireWalletKey).toHaveBeenCalledWith({ walletId: account.walletId })
      expect(mocks.walletFindUnique).toHaveBeenCalledWith(mocks.appContext, account.walletId)
      expect(result).toBe(true)
    })

    it('should report unsecured active wallet as unlocked without requiring the wallet key', async () => {
      // ARRANGE
      expect.assertions(2)
      mocks.walletFindUnique.mockResolvedValue({ ...wallet, protectionMode: 'unsecured' })
      const service = registerVaultRuntimeService(appContext)

      // ACT
      const result = await service.isActiveWalletUnlocked()

      // ASSERT
      expect(mocks.appContext.vault.requireWalletKey).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should unlock a PIN active wallet by wallet id', async () => {
      // ARRANGE
      expect.assertions(2)
      const service = registerVaultRuntimeService(appContext)

      // ACT
      await service.unlockActiveWallet({ credential })

      // ASSERT
      expect(mocks.appContext.vault.unlock).not.toHaveBeenCalled()
      expect(mocks.appContext.vault.unlockWallet).toHaveBeenCalledWith({ credential, walletId: account.walletId })
    })

    it('should unlock a password active wallet through the vault password', async () => {
      // ARRANGE
      expect.assertions(2)
      mocks.walletFindUnique.mockResolvedValue({ ...wallet, protectionMode: 'password' })
      const service = registerVaultRuntimeService(appContext)

      // ACT
      await service.unlockActiveWallet({ credential })

      // ASSERT
      expect(mocks.appContext.vault.unlock).toHaveBeenCalledWith({ password: credential })
      expect(mocks.appContext.vault.unlockWallet).not.toHaveBeenCalled()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return false when the active wallet key is locked', async () => {
      // ARRANGE
      expect.assertions(1)
      mocks.appContext.vault.requireWalletKey.mockRejectedValue(new Error('Wallet is locked'))
      const service = registerVaultRuntimeService(appContext)

      // ACT
      const result = await service.isActiveWalletUnlocked()

      // ASSERT
      expect(result).toBe(false)
    })
  })
})
