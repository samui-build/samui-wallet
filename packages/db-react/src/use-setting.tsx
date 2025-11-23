import type { SettingKey } from '@workspace/db/setting/setting-key'

import { useSettingGetValueLive } from './use-setting-get-value-live.tsx'
import { useSettingSetValue } from './use-setting-set-value.tsx'

export function useSetting(key: SettingKey): [null | string, (newValue: string) => Promise<void>] {
  const getValue = useSettingGetValueLive(key)
  const setValue = useSettingSetValue(key)

  return [getValue, (newValue: string) => setValue.mutateAsync(newValue)]
}
