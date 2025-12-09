import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function networkDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.networks, db.settings, async () => {
    const activeNetworkId = (await settingFindUnique(db, 'activeNetworkId'))?.value
    if (id === activeNetworkId) {
      throw new Error('You cannot delete the active network. Please change networks and try again.')
    }
    const { data, error } = await tryCatch(db.networks.delete(id))
    if (error) {
      console.log(error)
      throw new Error(`Error deleting network with id ${id}`)
    }
    return data
  })
}
