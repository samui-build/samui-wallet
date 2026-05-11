import type { AppContext } from '@workspace/context/app-context'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { registerDbService } from '../src/services/db.ts'

const mocks = vi.hoisted(() => ({
  accountCreate: vi.fn(),
  accountFindUnique: vi.fn(),
  accountReadSecretKey: vi.fn(),
  address: vi.fn(),
  addressEncode: vi.fn(),
  createKeyPairFromBytes: vi.fn(),
  createProxyService: vi.fn(),
  db: { id: 'db' },
  deriveFromMnemonicAtIndex: vi.fn(),
  ellipsify: vi.fn(),
  getAddressEncoder: vi.fn(),
  registerService: vi.fn(),
  settingFindUnique: vi.fn(),
  walletCreate: vi.fn(),
}))

vi.mock('@solana/kit', () => ({
  address: mocks.address,
  createKeyPairFromBytes: mocks.createKeyPairFromBytes,
  getAddressEncoder: mocks.getAddressEncoder,
}))

vi.mock('@solana/wallet-standard-chains', () => ({
  SOLANA_CHAINS: [],
}))

vi.mock('@solana/wallet-standard-features', () => ({
  SolanaSignAndSendTransaction: 'solana:signAndSendTransaction',
  SolanaSignIn: 'solana:signIn',
  SolanaSignMessage: 'solana:signMessage',
  SolanaSignTransaction: 'solana:signTransaction',
}))

vi.mock('@webext-core/proxy-service', () => ({
  createProxyService: mocks.createProxyService,
  registerService: mocks.registerService,
}))

vi.mock('@workspace/db/account/account-create', () => ({
  accountCreate: mocks.accountCreate,
}))

vi.mock('@workspace/db/account/account-find-unique', () => ({
  accountFindUnique: mocks.accountFindUnique,
}))

vi.mock('@workspace/db/account/account-read-secret-key', () => ({
  accountReadSecretKey: mocks.accountReadSecretKey,
}))

vi.mock('@workspace/db/setting/setting-find-unique', () => ({
  settingFindUnique: mocks.settingFindUnique,
}))

vi.mock('@workspace/db/wallet/wallet-create', () => ({
  walletCreate: mocks.walletCreate,
}))

vi.mock('@workspace/keypair/derive-from-mnemonic-at-index', () => ({
  deriveFromMnemonicAtIndex: mocks.deriveFromMnemonicAtIndex,
}))

vi.mock('@workspace/ui/lib/ellipsify', () => ({
  ellipsify: mocks.ellipsify,
}))

const activeAccount = {
  publicKey: 'active-public-key',
  walletId: 'wallet-id',
}
const accountId = 'active-account-id'
const backgroundContext = { db: mocks.db, vault: { id: 'vault' } } as unknown as AppContext
const keyPair = {
  privateKey: { id: 'private-key' } as unknown as CryptoKey,
  publicKey: { id: 'public-key' } as unknown as CryptoKey,
}
const publicKeyBytes = new Uint8Array([5, 6])
const secretKey = JSON.stringify([1, 2, 3, 4])
const secretKeyBytes = new Uint8Array([1, 2, 3, 4])

describe('db-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.accountFindUnique.mockResolvedValue(activeAccount)
    mocks.accountReadSecretKey.mockResolvedValue(secretKey)
    mocks.address.mockReturnValue(activeAccount.publicKey)
    mocks.addressEncode.mockReturnValue(publicKeyBytes)
    mocks.createKeyPairFromBytes.mockResolvedValue(keyPair)
    mocks.getAddressEncoder.mockReturnValue({ encode: mocks.addressEncode })
    mocks.settingFindUnique.mockResolvedValue({ value: accountId })
  })

  describe('expected behavior', () => {
    it('should create the active account key pair from the active secret key', async () => {
      // ARRANGE
      expect.assertions(4)
      const service = registerDbService(backgroundContext)

      // ACT
      const result = await service.account.keyPair()

      // ASSERT
      expect(mocks.accountReadSecretKey).toHaveBeenCalledWith(backgroundContext, accountId)
      expect(mocks.createKeyPairFromBytes).toHaveBeenCalledWith(secretKeyBytes)
      expect(mocks.settingFindUnique).toHaveBeenCalledWith(backgroundContext, 'activeAccountId')
      expect(result).toBe(keyPair)
    })

    it('should return public account metadata without reading secret data', async () => {
      // ARRANGE
      expect.assertions(5)
      const service = registerDbService(backgroundContext)

      // ACT
      const result = await service.account.walletAccounts()

      // ASSERT
      expect(mocks.accountReadSecretKey).not.toHaveBeenCalled()
      expect(mocks.addressEncode).toHaveBeenCalledWith(activeAccount.publicKey)
      expect(result.accounts[0]).not.toHaveProperty('secretKey')
      expect(result.accounts[0]?.address).toBe(activeAccount.publicKey)
      expect(result.accounts[0]?.publicKey).toBe(publicKeyBytes)
    })
  })

  describe('unexpected behavior', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('should throw an error when the active secret key is not found', async () => {
      // ARRANGE
      expect.assertions(2)
      mocks.accountReadSecretKey.mockResolvedValue(undefined)
      const service = registerDbService(backgroundContext)

      // ACT & ASSERT
      await expect(service.account.keyPair()).rejects.toThrow('Active account secretKey not found')
      expect(mocks.createKeyPairFromBytes).not.toHaveBeenCalled()
    })
  })
})
