import { useLiveQuery } from 'dexie-react-hooks'
import type { Preference } from '@workspace/db/entity/preference'
import { db } from '@workspace/db/db'

export function useDbPreferenceLive() {
  return useLiveQuery<Preference[], Preference[]>(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return db.preferences.orderBy('key').toArray()
    },
    [],
    [],
  )
}
