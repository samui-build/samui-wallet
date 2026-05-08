import type { DbContext } from './db-context.ts'

import { populate } from './populate.ts'

export async function reset(ctx: DbContext) {
  await Promise.all(ctx.db.tables.map((table) => table.clear()))
  await populate(ctx)
}
