import { useQuery } from '@tanstack/react-query'
import type { SettingKey } from '@workspace/db/entity/setting-key'

import { dbSettingOptions } from './db-setting-options.tsx'

export function useDbSettingGetValue(key: SettingKey) {
  return useQuery(dbSettingOptions.getValue(key))
}
