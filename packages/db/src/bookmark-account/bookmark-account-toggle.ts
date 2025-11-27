import type { Address } from '@solana/kit'
import type { Database } from '../database.ts'

import { bookmarkAccountCreate } from './bookmark-account-create.ts'
import { bookmarkAccountDelete } from './bookmark-account-delete.ts'
import { bookmarkAccountFindByAddress } from './bookmark-account-find-by-address.ts'

export async function bookmarkAccountToggle(db: Database, address: Address): Promise<'created' | 'deleted'> {
  return db.transaction('rw', db.bookmarkAccounts, async () => {
    const existing = await bookmarkAccountFindByAddress(db, address)
    if (existing) {
      await bookmarkAccountDelete(db, existing.id)
      return 'deleted'
    }
    await bookmarkAccountCreate(db, { address })
    return 'created'
  })
}
