import { useMutation } from '@tanstack/react-query'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import type { SettingSetValueMutateOptions } from './options-setting.tsx'
import { optionsSetting } from './options-setting.tsx'

export function useSettingSetValue(key: SettingKey, props: SettingSetValueMutateOptions = {}) {
  return useMutation(optionsSetting.update(key, props))
}
