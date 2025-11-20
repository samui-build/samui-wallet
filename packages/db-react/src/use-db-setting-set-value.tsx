import { useMutation } from '@tanstack/react-query'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import type { DbSettingSetValueMutateOptions } from './db-setting-options.tsx'
import { dbSettingOptions } from './db-setting-options.tsx'

export function useDbSettingSetValue(key: SettingKey, props: DbSettingSetValueMutateOptions = {}) {
  return useMutation(dbSettingOptions.setValue(key, props))
}
