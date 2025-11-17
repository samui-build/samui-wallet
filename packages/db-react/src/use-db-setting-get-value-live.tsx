import { db } from '@workspace/db/db'
import { dbSettingGetValue } from '@workspace/db/db-setting-get-value'
import type { SettingKey } from '@workspace/db/entity/setting-key'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useDbSettingGetValueLive(key: SettingKey) {
  const data = useRootLoaderData()
  if (!data?.settings) {
    throw new Error('Root loader not called.')
  }

  const value = data.settings.find((s) => s.key === key)?.value ?? null

  return useLiveQuery<null | string, null | string>(() => dbSettingGetValue(db, key), [key], value)
}
