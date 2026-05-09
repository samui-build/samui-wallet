import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import { encryptWithVaultKey } from '@workspace/vault/encrypted-value'

import type { DbContext } from '../db-context.ts'
import { randomId } from '../random-id.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'
import { settingSetValue } from '../setting/setting-set-value.ts'
import { accountCreateDetermineOrder } from './account-create-determine-order.ts'
import type { AccountCreateInput } from './account-create-input.ts'
import { accountCreateSchema } from './account-create-schema.ts'

export async function accountCreate(ctx: DbContext, input: AccountCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = accountCreateSchema.parse(input)
  const secretKey =
    parsedInput.type === 'Watched' || !parsedInput.secretKey
      ? parsedInput.secretKey
      : await encryptWithVaultKey({
          key: await ctx.vault.requireWalletKey({ walletId: parsedInput.walletId }),
          value: parsedInput.secretKey,
        })

  return ctx.db.transaction('rw', ctx.db.accounts, ctx.db.settings, ctx.db.wallets, async () => {
    const order = await accountCreateDetermineOrder(ctx, parsedInput.walletId)
    const data = await tryCatchOrThrow(
      ctx.db.accounts.add({
        ...parsedInput,
        createdAt: now,
        derivationIndex: parsedInput.derivationIndex ?? 0,
        id: randomId(),
        order: order,
        secretKey,
        updatedAt: now,
      }),
      `Error creating account`,
    )

    const activeAccountId = (await settingFindUnique(ctx, 'activeAccountId'))?.value
    if (!activeAccountId) {
      await settingSetValue(ctx, 'activeAccountId', data)
    }

    return data
  })
}
