import type { SettingKey } from '@workspace/db/setting/setting-key'

import { useDbSettingGetValueLive } from './use-db-setting-get-value-live.tsx'
import { useDbSettingSetValue } from './use-db-setting-set-value.tsx'

export function useDbSetting(key: SettingKey): [null | string, (newValue: string) => Promise<void>] {
  const getValue = useDbSettingGetValueLive(key)
  const setValue = useDbSettingSetValue(key)

  return [getValue, (newValue: string) => setValue.mutateAsync(newValue)]
}
