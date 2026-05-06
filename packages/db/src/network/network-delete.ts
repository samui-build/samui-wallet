import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function networkDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.networks, db.settings, async () => {
    const activeNetworkId = (await settingFindUnique(db, 'activeNetworkId'))?.value
    if (id === activeNetworkId) {
      throw new Error('You cannot delete the active network. Please change networks and try again.')
    }
    return tryCatchOrThrow(db.networks.delete(id), `Error deleting network with id ${id}`)
  })
}
