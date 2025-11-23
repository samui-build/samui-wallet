import { useQuery } from '@tanstack/react-query'
import type { SettingKey } from '@workspace/db/setting/setting-key'

import { optionsSetting } from './options-setting.tsx'

export function useSettingGetValue(key: SettingKey) {
  return useQuery(optionsSetting.getValue(key))
}
