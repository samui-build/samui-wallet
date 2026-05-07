import type { Address } from '@solana/kit'
import type { AppContext } from '../app-context.ts'

import { bookmarkAccountCreate } from './bookmark-account-create.ts'
import { bookmarkAccountDelete } from './bookmark-account-delete.ts'
import { bookmarkAccountFindByAddress } from './bookmark-account-find-by-address.ts'

export async function bookmarkAccountToggle(ctx: AppContext, address: Address): Promise<'created' | 'deleted'> {
  return ctx.db.transaction('rw', ctx.db.bookmarkAccounts, async () => {
    const existing = await bookmarkAccountFindByAddress(ctx, address)
    if (existing) {
      await bookmarkAccountDelete(ctx, existing.id)
      return 'deleted'
    }
    await bookmarkAccountCreate(ctx, { address })
    return 'created'
  })
}
