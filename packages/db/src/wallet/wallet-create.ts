import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import { encryptWithVaultKey } from '@workspace/vault/encrypted-value'
import {
  createPasswordWalletProtection,
  createPinWalletProtection,
  createUnsecuredWalletProtection,
  unlockPinWalletProtection,
  unlockUnsecuredWalletProtection,
} from '@workspace/vault/wallet-protection'
import type { DbContext } from '../db-context.ts'
import { randomId } from '../random-id.ts'
import { walletCreateDetermineOrder } from './wallet-create-determine-order.ts'
import type { WalletCreateInput } from './wallet-create-input.ts'
import { walletCreateSchema } from './wallet-create-schema.ts'

export async function walletCreate(ctx: DbContext, input: WalletCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = walletCreateSchema.parse(input)
  const { key, protection } = await createWalletProtection({
    protection: parsedInput.protection,
    requireDefaultKey: () => ctx.vault.requireDefaultKey(),
  })
  const mnemonic = await encryptWithVaultKey({ key, value: parsedInput.mnemonic })

  return ctx.db.transaction('rw', ctx.db.wallets, ctx.db.settings, ctx.db.accounts, async () => {
    const order = await walletCreateDetermineOrder(ctx)

    return tryCatchOrThrow(
      ctx.db.wallets.add({
        accounts: [],
        color: parsedInput.color,
        createdAt: now,
        derivationPath: parsedInput.derivationPath,
        description: parsedInput.description,
        id: randomId(),
        mnemonic,
        name: parsedInput.name,
        order,
        secret: protection,
        updatedAt: now,
      }),
      `Error creating wallet`,
    )
  })
}

async function createWalletProtection(input: {
  protection: WalletCreateInput['protection']
  requireDefaultKey: () => CryptoKey
}): Promise<{ key: CryptoKey; protection: string }> {
  switch (input.protection?.mode) {
    case 'password':
      return { key: input.requireDefaultKey(), protection: createPasswordWalletProtection() }
    case 'pin': {
      const protection = await createPinWalletProtection({ pin: input.protection.pin })
      return { key: await unlockPinWalletProtection({ pin: input.protection.pin, protection }), protection }
    }
    case 'unsecured': {
      const protection = createUnsecuredWalletProtection()
      return { key: await unlockUnsecuredWalletProtection({ protection }), protection }
    }
    default:
      return { key: input.requireDefaultKey(), protection: createPasswordWalletProtection() }
  }
}
