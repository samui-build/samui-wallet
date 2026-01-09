import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import type { Account } from './account.ts'
import type { AccountUpdateOrderInput } from './account-update-order-input.ts'
import { accountUpdateOrderSchema } from './account-update-order-schema.ts'

export async function accountUpdateOrder(db: Database, input: AccountUpdateOrderInput): Promise<void> {
  const { id, order } = accountUpdateOrderSchema.parse(input)

  return db.transaction('rw', db.accounts, async () => {
    const [account, accountCount] = await Promise.all([db.accounts.get(id), db.accounts.count()])
    if (!account) {
      throw new Error(`Account with id ${id} not found`)
    }
    if (accountCount === 0) {
      return
    }

    const newOrder = Math.max(0, Math.min(order, accountCount - 1))
    const oldOrder = account.order

    if (oldOrder === newOrder) {
      return
    }

    // If the new order is less than the old order, we are moving the account up (incrementing the order of others)
    // If the new order is greater than the old order, we are moving the account down (decrementing the order of others)
    const increment = newOrder < oldOrder
    const lower = increment ? newOrder : oldOrder + 1
    const upper = increment ? oldOrder - 1 : newOrder
    const { error: updateAccountsError } = await tryCatch(
      db.accounts
        .where('order')
        .between(lower, upper, true, true)
        .modify((account: Account) => {
          account.order = increment ? account.order + 1 : account.order - 1
        }),
    )
    if (updateAccountsError) {
      throw new Error(`Error updating account order (${increment ? 'increment' : 'decrement'})`)
    }

    // Finally, update the moved account's order
    const { error: updateError } = await tryCatch(db.accounts.update(id, { order: newOrder }))

    if (updateError) {
      console.log(updateError)
      throw new Error(`Error moving account with id ${id}`)
    }
  })
}
