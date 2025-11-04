import { db } from '@workspace/db/db'
import { dbPreferenceGetValue } from '@workspace/db/db-preference-get-value'
import type { PreferenceKey } from '@workspace/db/entity/preference-key'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbPreferenceGetValueLive(key: PreferenceKey) {
  return useLiveQuery<null | string, null>(() => dbPreferenceGetValue(db, key), [key], null)
}
