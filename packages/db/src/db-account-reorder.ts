import type { Collection } from 'dexie'

import type { Database } from './database'
import type { Account } from './entity/account'

export async function dbAccountReorder(db: Database, accountId: string, newOrder: number): Promise<void> {
  await db.transaction('rw', db.accounts, async () => {
    // 1. Get the account to move
    const accountToMove = await db.accounts.get(accountId)
    if (!accountToMove) {
      console.log(`Account with id ${accountId} not found for re-ordering.`)
      return
    }

    const oldOrder = accountToMove.order

    // If order is unchanged, do nothing.
    if (oldOrder === newOrder) {
      return
    }

    // 2. Determine which accounts to shift
    let accountsToShift: Collection<Account, string>
    let shiftAmount: number

    if (oldOrder < newOrder) {
      // Moved DOWN the list (e.g., from 2 to 5)
      // Items from 3 to 5 need to shift UP (order - 1)
      accountsToShift = db.accounts.where('order').between(oldOrder + 1, newOrder, true, true)
      shiftAmount = -1
    } else {
      // Moved UP the list (e.g., from 5 to 2)
      // Items from 2 to 4 need to shift DOWN (order + 1)
      accountsToShift = db.accounts.where('order').between(newOrder, oldOrder - 1, true, true)
      shiftAmount = 1
    }

    // 3. Shift the affected accounts
    const updates = (await accountsToShift.toArray()).map((account) => ({
      changes: { order: account.order + shiftAmount },
      key: account.id,
    }))

    if (updates.length > 0) {
      await db.accounts.bulkUpdate(updates)
    }

    // 4. Update the order of the moved account
    await db.accounts.update(accountId, { order: newOrder, updatedAt: new Date() })

    // 5. (Optional but recommended) Re-sequence all accounts to ensure there are no gaps
    const allAccounts = await db.accounts.orderBy('order').toArray()
    const resequenceUpdates = allAccounts.map((account, index) => ({ changes: { order: index }, key: account.id }))
    await db.accounts.bulkUpdate(resequenceUpdates)
  })
}
