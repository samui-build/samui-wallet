import type { Setting } from '@workspace/db/setting/setting'
import { settingFindMany } from '@workspace/db/setting/setting-find-many'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAppContext } from './use-app-context.tsx'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useSettingGetValueLive(key: SettingKey) {
  const ctx = useAppContext()
  const data = useRootLoaderData()
  if (!data?.settings) {
    throw new Error('Root loader not called.')
  }

  const settings = useLiveQuery<Setting[], Setting[]>(() => settingFindMany(ctx), [ctx], data.settings)
  return settings.find((s) => s.key === key)?.value ?? null
}
