import { decryptWithVaultKey, encryptWithVaultKey } from '@workspace/vault/encrypted-value'
import {
  createPasswordWalletProtection,
  createPinWalletProtection,
  createUnsecuredWalletProtection,
  unlockPinWalletProtection,
  unlockUnsecuredWalletProtection,
} from '@workspace/vault/wallet-protection'
import { Dexie } from 'dexie'
import type { DbContext } from '../db-context.ts'

export interface WalletReprotectInput {
  protection: { mode: 'password' } | { mode: 'pin'; pin: string } | { mode: 'unsecured' }
  walletId: string
}

export async function walletReprotect(ctx: DbContext, input: WalletReprotectInput): Promise<void> {
  const { db, vault } = ctx

  await db.transaction('rw', db.accounts, db.wallets, async () => {
    const wallet = await db.wallets.where('id').equals(input.walletId).raw().first()
    if (!wallet) {
      throw new Error(`Wallet with id ${input.walletId} not found`)
    }

    const accounts = await db.accounts.where('walletId').equals(input.walletId).raw().toArray()
    const currentKey = await Dexie.waitFor(vault.requireWalletKey({ walletId: input.walletId }))
    const mnemonic = await Dexie.waitFor(decryptWithVaultKey({ encrypted: wallet.mnemonic, key: currentKey }))
    const accountSecrets = await Dexie.waitFor(
      Promise.all(
        accounts.map(async (account) => ({
          id: account.id,
          secretKey: account.secretKey
            ? await decryptWithVaultKey({ encrypted: account.secretKey, key: currentKey })
            : undefined,
        })),
      ),
    )
    const target = await Dexie.waitFor(createTargetProtection({ protection: input.protection, vault }))

    await db.wallets.update(input.walletId, {
      mnemonic: await Dexie.waitFor(encryptWithVaultKey({ key: target.key, value: mnemonic })),
      secret: target.protection,
    })

    for (const account of accountSecrets) {
      if (!account.secretKey) {
        continue
      }
      await db.accounts.update(account.id, {
        secretKey: await Dexie.waitFor(encryptWithVaultKey({ key: target.key, value: account.secretKey })),
      })
    }
  })
  vault.clearWalletKey({ walletId: input.walletId })
}

async function createTargetProtection(input: {
  protection: WalletReprotectInput['protection']
  vault: DbContext['vault']
}): Promise<{ key: CryptoKey; protection: string }> {
  switch (input.protection.mode) {
    case 'password':
      return { key: input.vault.requireDefaultKey(), protection: createPasswordWalletProtection() }
    case 'pin': {
      const protection = await createPinWalletProtection({ pin: input.protection.pin })
      return { key: await unlockPinWalletProtection({ pin: input.protection.pin, protection }), protection }
    }
    case 'unsecured': {
      const protection = createUnsecuredWalletProtection()
      return { key: await unlockUnsecuredWalletProtection({ protection }), protection }
    }
  }
}
