import { db } from '@workspace/db/db'
import type { Setting } from '@workspace/db/setting/setting'
import { settingGetAll } from '@workspace/db/setting/setting-get-all'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useSettingGetValueLive(key: SettingKey) {
  const data = useRootLoaderData()
  if (!data?.settings) {
    throw new Error('Root loader not called.')
  }

  const settings = useLiveQuery<Setting[], Setting[]>(() => settingGetAll(db), [], data.settings)
  return settings.find((s) => s.key === key)?.value ?? null
}
