import { db } from '@workspace/db/db'
import { dbSettingGetValue } from '@workspace/db/db-setting-get-value'
import type { SettingKey } from '@workspace/db/entity/setting-key'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbSettingGetValueLive(key: SettingKey) {
  return useLiveQuery<null | string, null>(() => dbSettingGetValue(db, key), [key], null)
}
