import type { Signature } from '@solana/kit'
import type { AppContext } from '../app-context.ts'

import { bookmarkTransactionCreate } from './bookmark-transaction-create.ts'
import { bookmarkTransactionDelete } from './bookmark-transaction-delete.ts'
import { bookmarkTransactionFindBySignature } from './bookmark-transaction-find-by-signature.ts'

export async function bookmarkTransactionToggle(ctx: AppContext, signature: Signature): Promise<'created' | 'deleted'> {
  return ctx.db.transaction('rw', ctx.db.bookmarkTransactions, async () => {
    const existing = await bookmarkTransactionFindBySignature(ctx, signature)
    if (existing) {
      await bookmarkTransactionDelete(ctx, existing.id)
      return 'deleted'
    }
    await bookmarkTransactionCreate(ctx, { signature })
    return 'created'
  })
}
