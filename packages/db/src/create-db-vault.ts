import { createVault, type Vault } from '@workspace/vault/vault'
import type { Database } from './database.ts'
import { randomId } from './random-id.ts'

export type { Vault } from '@workspace/vault/vault'

export function createDbVault({ db }: { db: Database }): Vault {
  return createVault({
    async getVaultKey() {
      return (await db.settings.get({ key: 'vaultKey' }))?.value
    },
    async getWalletProtection(walletId: string) {
      const wallet = await db.wallets.where('id').equals(walletId).raw().first()
      if (!wallet) {
        throw new Error(`Wallet with id ${walletId} not found`)
      }

      return wallet.secret
    },
    async setVaultKey(value: string) {
      const now = new Date()
      await db.transaction('rw', db.settings, async () => {
        const setting = await db.settings.get({ key: 'vaultKey' })
        if (setting) {
          await db.settings.update(setting.id, { updatedAt: now, value })
          return
        }
        await db.settings.add({ createdAt: now, id: randomId(), key: 'vaultKey', updatedAt: now, value })
      })
    },
  })
}
