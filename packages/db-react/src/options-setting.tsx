import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { settingGetAll } from '@workspace/db/setting/setting-get-all'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import { settingSetValue } from '@workspace/db/setting/setting-set-value'
import { toastError } from '@workspace/ui/lib/toast-error'
import { queryClient } from './query-client.tsx'

export type SettingSetValueMutateOptions = MutateOptions<void, Error, string>

export const optionsSetting = {
  getAll: () =>
    queryOptions({
      queryFn: () => settingGetAll(db),
      queryKey: ['settingGetAll'],
    }),
  setValue: (key: SettingKey, props: SettingSetValueMutateOptions = {}) =>
    mutationOptions({
      mutationFn: (value: string) => settingSetValue(db, key, value),
      onError: () => toastError('Error setting value'),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.getAll())
      },
      ...props,
    }),
}
