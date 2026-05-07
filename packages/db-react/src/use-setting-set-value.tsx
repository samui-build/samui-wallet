import { useMutation } from '@tanstack/react-query'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import type { SettingSetValueMutateOptions } from './options-setting.tsx'
import { optionsSetting } from './options-setting.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useSettingSetValue(key: SettingKey, props: SettingSetValueMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsSetting.update(ctx, key, props))
}
