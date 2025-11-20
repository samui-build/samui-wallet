import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { settingGetAll } from '@workspace/db/setting/setting-get-all'
import { settingGetValue } from '@workspace/db/setting/setting-get-value'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import { settingSetValue } from '@workspace/db/setting/setting-set-value'
import { toastError } from '@workspace/ui/lib/toast-error'
import { queryClient } from './db-query-client.tsx'

export type DbSettingSetValueMutateOptions = MutateOptions<void, Error, string>

export const dbSettingOptions = {
  getAll: () =>
    queryOptions({
      queryFn: () => settingGetAll(db),
      queryKey: ['settingGetAll'],
    }),
  getValue: (key: SettingKey) =>
    queryOptions({
      queryFn: () => settingGetValue(db, key),
      queryKey: ['settingGetValue', key],
    }),
  setValue: (key: SettingKey, props: DbSettingSetValueMutateOptions = {}) =>
    mutationOptions({
      mutationFn: (value: string) => settingSetValue(db, key, value),
      onError: () => toastError('Error setting value'),
      onSuccess: () => {
        queryClient.invalidateQueries(dbSettingOptions.getValue(key))
        queryClient.invalidateQueries(dbSettingOptions.getAll())
      },
      ...props,
    }),
}
