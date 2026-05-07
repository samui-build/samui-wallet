import type { AppContext } from './app-context.ts'

import { populate } from './populate.ts'

export async function reset(ctx: AppContext) {
  await Promise.all(ctx.db.tables.map((table) => table.clear()))
  await populate(ctx)
}
