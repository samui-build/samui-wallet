import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function networkDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.networks, db.settings, async () => {
    const activeNetworkId = (await settingFindUnique(db, 'activeNetworkId'))?.value
    if (id === activeNetworkId) {
      throw new Error('You cannot delete the active network. Please change networks and try again.')
    }
    const result = await Result.tryPromise(() => db.networks.delete(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error deleting network with id ${id}`)
    }
    return result.value
  })
}
