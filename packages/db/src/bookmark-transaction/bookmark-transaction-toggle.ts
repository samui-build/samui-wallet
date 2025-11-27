import type { Signature } from '@solana/kit'
import type { Database } from '../database.ts'

import { bookmarkTransactionCreate } from './bookmark-transaction-create.ts'
import { bookmarkTransactionDelete } from './bookmark-transaction-delete.ts'
import { bookmarkTransactionFindBySignature } from './bookmark-transaction-find-by-signature.ts'

export async function bookmarkTransactionToggle(db: Database, signature: Signature): Promise<'created' | 'deleted'> {
  return db.transaction('rw', db.bookmarkTransactions, async () => {
    const existing = await bookmarkTransactionFindBySignature(db, signature)
    if (existing) {
      await bookmarkTransactionDelete(db, existing.id)
      return 'deleted'
    } else {
      await bookmarkTransactionCreate(db, { signature })
      return 'created'
    }
  })
}
