import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function networkDelete(ctx: AppContext, id: string): Promise<void> {
  return ctx.db.transaction('rw', ctx.db.networks, ctx.db.settings, async () => {
    const activeNetworkId = (await settingFindUnique(ctx, 'activeNetworkId'))?.value
    if (id === activeNetworkId) {
      throw new Error('You cannot delete the active network. Please change networks and try again.')
    }
    return tryCatchOrThrow(ctx.db.networks.delete(id), `Error deleting network with id ${id}`)
  })
}
