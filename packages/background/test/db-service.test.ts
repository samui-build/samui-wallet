import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { registerDbService } from '../src/services/db.ts'

const mocks = vi.hoisted(() => ({
  accountCreate: vi.fn(),
  accountFindUnique: vi.fn(),
  accountReadSecretKey: vi.fn(),
  address: vi.fn(),
  appContext: { db: { id: 'db' } },
  createAppContext: vi.fn(),
  createKeyPairFromBytes: vi.fn(),
  createProxyService: vi.fn(),
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

vi.mock('@workspace/db/create-app-context', () => ({
  createAppContext: mocks.createAppContext,
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

const accountId = 'active-account-id'
const keyPair = {
  privateKey: { id: 'private-key' } as unknown as CryptoKey,
  publicKey: { id: 'public-key' } as unknown as CryptoKey,
}
const secretKey = JSON.stringify([1, 2, 3, 4])
const secretKeyBytes = new Uint8Array([1, 2, 3, 4])

describe('db-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.accountReadSecretKey.mockResolvedValue(secretKey)
    mocks.createAppContext.mockReturnValue(mocks.appContext)
    mocks.createKeyPairFromBytes.mockResolvedValue(keyPair)
    mocks.settingFindUnique.mockResolvedValue({ value: accountId })
  })

  describe('expected behavior', () => {
    it('should create the active account key pair from the active secret key', async () => {
      // ARRANGE
      expect.assertions(4)
      const service = registerDbService()

      // ACT
      const result = await service.account.keyPair()

      // ASSERT
      expect(mocks.accountReadSecretKey).toHaveBeenCalledWith(mocks.appContext, accountId)
      expect(mocks.createKeyPairFromBytes).toHaveBeenCalledWith(secretKeyBytes)
      expect(mocks.settingFindUnique).toHaveBeenCalledWith(mocks.appContext, 'activeAccountId')
      expect(result).toBe(keyPair)
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
      const service = registerDbService()

      // ACT & ASSERT
      await expect(service.account.keyPair()).rejects.toThrow('Active account secretKey not found')
      expect(mocks.createKeyPairFromBytes).not.toHaveBeenCalled()
    })
  })
})
