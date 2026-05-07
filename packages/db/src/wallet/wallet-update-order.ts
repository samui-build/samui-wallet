import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { AppContext } from '../app-context.ts'
import type { Wallet } from './wallet.ts'
import type { WalletUpdateOrderInput } from './wallet-update-order-input.ts'
import { walletUpdateOrderSchema } from './wallet-update-order-schema.ts'

export async function walletUpdateOrder(ctx: AppContext, input: WalletUpdateOrderInput): Promise<void> {
  const { id, order } = walletUpdateOrderSchema.parse(input)

  return ctx.db.transaction('rw', ctx.db.wallets, async () => {
    const [wallet, walletCount] = await Promise.all([ctx.db.wallets.get(id), ctx.db.wallets.count()])
    if (!wallet) {
      throw new Error(`Wallet with id ${id} not found`)
    }
    if (walletCount === 0) {
      return
    }

    const newOrder = Math.max(0, Math.min(order, walletCount - 1))
    const oldOrder = wallet.order

    if (oldOrder === newOrder) {
      return
    }

    // If the new order is less than the old order, we are moving the wallet up (incrementing the order of others)
    // If the new order is greater than the old order, we are moving the wallet down (decrementing the order of others)
    const increment = newOrder < oldOrder
    const lower = increment ? newOrder : oldOrder + 1
    const upper = increment ? oldOrder - 1 : newOrder
    await tryCatchOrThrow(
      ctx.db.wallets
        .where('order')
        .between(lower, upper, true, true)
        .modify((wallet: Wallet) => {
          wallet.order = increment ? wallet.order + 1 : wallet.order - 1
        }),
      `Error updating wallet order (${increment ? 'increment' : 'decrement'})`,
    )

    // Finally, update the moved wallet's order
    await tryCatchOrThrow(ctx.db.wallets.update(id, { order: newOrder }), `Error moving wallet with id ${id}`)
  })
}
