import { db } from '@workspace/db/db'
import { dbSettingGetValue } from '@workspace/db/db-setting-get-value'
import type { SettingKey } from '@workspace/db/entity/setting-key'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRouteLoaderData } from 'react-router'
import type { DbLoaderData } from './db-loader.tsx'

export function useDbSettingGetValueLive(key: SettingKey) {
  const data = useRouteLoaderData<DbLoaderData>('root')
  if (!data?.settings) {
    throw new Error('Loader not called.')
  }

  const value = data.settings.find((s) => s.key === key)?.value ?? null

  return useLiveQuery<null | string, null | string>(() => dbSettingGetValue(db, key), [key], value)
}
