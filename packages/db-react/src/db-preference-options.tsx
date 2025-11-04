import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbPreferenceGetValue } from '@workspace/db/db-preference-get-value'
import { dbPreferenceSetValue } from '@workspace/db/db-preference-set-value'
import type { PreferenceKey } from '@workspace/db/entity/preference-key'
import { toastError } from '@workspace/ui/lib/toast-error'

export type DbPreferenceSetValueMutateOptions = MutateOptions<void, Error, string>

export const dbPreferenceOptions = {
  getValue: (key: PreferenceKey) =>
    queryOptions({
      queryFn: () => dbPreferenceGetValue(db, key),
      queryKey: ['dbPreferenceGetValue', key],
    }),
  setValue: (key: PreferenceKey, props: DbPreferenceSetValueMutateOptions = {}) =>
    mutationOptions({
      mutationFn: (value: string) => dbPreferenceSetValue(db, key, value),
      onError: () => toastError('Error setting preference'),
      ...props,
    }),
}
