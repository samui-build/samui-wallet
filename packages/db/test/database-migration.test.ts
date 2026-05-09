import 'fake-indexeddb/auto'
import { address } from '@solana/kit'
import { isEncryptedValue } from '@workspace/vault/encrypted-value'
import { walletProtectionSchema } from '@workspace/vault/wallet-protection-schema'
import { Dexie } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountReadSecretKey } from '../src/account/account-read-secret-key.ts'
import { createDb } from '../src/create-db.ts'
import { createDbVault } from '../src/create-db-vault.ts'
import { walletReadMnemonic } from '../src/wallet/wallet-read-mnemonic.ts'

const legacyStores = {
  accounts: 'id, [order+walletId], derivationIndex, order, publicKey, type, walletId',
  bookmarkAccounts: 'id, address, label, updatedAt',
  bookmarkTransactions: 'id, signature, label, updatedAt',
  networks: 'id, name, type',
  settings: 'id, &key',
  wallets: 'id, name, order',
}

describe('database-migration', () => {
  let dbName: string

  beforeEach(() => {
    dbName = `database-migration-${crypto.randomUUID()}`
  })

  afterEach(async () => {
    await Dexie.delete(dbName)
  })

  describe('expected behavior', () => {
    it('should migrate legacy plaintext wallets to unsecured encrypted wallets', async () => {
      // ARRANGE
      expect.assertions(10)
      await seedLegacyPlaintextDatabase(dbName)

      // ACT
      const db = createDb({ name: dbName })
      try {
        const context = { db, vault: createDbVault({ db }) }
        const rawWallet = await db.wallets.where('id').equals('legacy-wallet-id').raw().first()
        const rawAccount = await db.accounts.where('id').equals('legacy-account-id').raw().first()
        const protection = walletProtectionSchema.parse(JSON.parse(rawWallet?.secret ?? '{}'))
        if (protection.mode !== 'unsecured') {
          throw new Error('Expected unsecured wallet protection')
        }
        const result = await walletReadMnemonic(context, 'legacy-wallet-id')
        const result1 = await accountReadSecretKey(context, 'legacy-account-id')

        // ASSERT
        expect(rawWallet?.mnemonic).not.toContain('legacy mnemonic')
        expect(rawAccount?.secretKey).not.toContain('legacy-secret-key')
        expect(isEncryptedValue(rawWallet?.mnemonic ?? '')).toBe(true)
        expect(isEncryptedValue(rawAccount?.secretKey ?? '')).toBe(true)
        expect(protection.mode).toBe('unsecured')
        expect(protection.version).toBe(1)
        expect(protection.keyMaterial).toBeTypeOf('string')
        expect(context.vault.isUnlocked()).toBe(false)
        expect(result).toBe('legacy mnemonic')
        expect(result1).toBe('legacy-secret-key')
      } finally {
        db.close()
      }
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should skip watched legacy accounts without secret keys', async () => {
      // ARRANGE
      expect.assertions(2)
      await seedLegacyPlaintextDatabase(dbName, { accountType: 'Watched' })

      // ACT
      const db = createDb({ name: dbName })
      try {
        const rawAccount = await db.accounts.where('id').equals('legacy-account-id').raw().first()
        const rawWallet = await db.wallets.where('id').equals('legacy-wallet-id').raw().first()

        // ASSERT
        expect(rawAccount?.secretKey).toBeUndefined()
        expect(walletProtectionSchema.parse(JSON.parse(rawWallet?.secret ?? '{}')).mode).toBe('unsecured')
      } finally {
        db.close()
      }
    })
  })
})

async function seedLegacyPlaintextDatabase(
  dbName: string,
  input: { accountType?: 'Derived' | 'Watched'; secretKey?: string } = {},
) {
  const db = new Dexie(dbName)
  try {
    db.version(1).stores(legacyStores)
    await db.open()
    const now = new Date()

    await db.table('wallets').add({
      accounts: [],
      createdAt: now,
      derivationPath: 'm/44/501/0/0',
      id: 'legacy-wallet-id',
      mnemonic: 'legacy mnemonic',
      name: 'Legacy Wallet',
      order: 0,
      secret: 'legacy-secret',
      updatedAt: now,
    })

    await db.table('accounts').add({
      createdAt: now,
      derivationIndex: 0,
      id: 'legacy-account-id',
      name: 'Legacy Account',
      order: 0,
      publicKey: address('So11111111111111111111111111111111111111112'),
      secretKey: input.accountType === 'Watched' ? undefined : (input.secretKey ?? 'legacy-secret-key'),
      type: input.accountType ?? 'Derived',
      updatedAt: now,
      walletId: 'legacy-wallet-id',
    })
  } finally {
    db.close()
  }
}
