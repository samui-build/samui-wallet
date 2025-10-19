import type { Preference } from '@workspace/db/entity/preference'
import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbPreferenceFindUniqueByKeyLive({ key }: { key: PreferenceKey }) {
  return useLiveQuery<Preference | undefined, Preference | undefined>(
    () => db.preferences.get({ key }),
    [key],
    undefined,
  )
}
