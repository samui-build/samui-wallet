import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'
import type { Network } from './network.ts'

export async function networkFindUnique(ctx: AppContext, id: string): Promise<Network | null> {
  return ctx.db.transaction('r', ctx.db.networks, async () => {
    const data = await tryCatchOrThrow(ctx.db.networks.get(id), `Error finding network with id ${id}`)
    return data ? data : null
  })
}
