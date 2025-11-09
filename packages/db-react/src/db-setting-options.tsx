import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbSettingGetValue } from '@workspace/db/db-setting-get-value'
import { dbSettingSetValue } from '@workspace/db/db-setting-set-value'
import type { SettingKey } from '@workspace/db/entity/setting-key'
import { toastError } from '@workspace/ui/lib/toast-error'

export type DbSettingSetValueMutateOptions = MutateOptions<void, Error, string>

export const dbSettingOptions = {
  getValue: (key: SettingKey) =>
    queryOptions({
      queryFn: () => dbSettingGetValue(db, key),
      queryKey: ['dbSettingGetValue', key],
    }),
  setValue: (key: SettingKey, props: DbSettingSetValueMutateOptions = {}) =>
    mutationOptions({
      mutationFn: (value: string) => dbSettingSetValue(db, key, value),
      onError: () => toastError('Error setting value'),
      ...props,
    }),
}
