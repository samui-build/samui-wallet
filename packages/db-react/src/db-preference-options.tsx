import type { PreferenceInputCreate } from '@workspace/db/dto/preference-input-create'
import type { PreferenceInputUpdate } from '@workspace/db/dto/preference-input-update'
import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbPreferenceCreate } from '@workspace/db/db-preference-create'
import { dbPreferenceFindUniqueByKey } from '@workspace/db/db-preference-find-unique-by-key'
import { dbPreferenceUpdateByKey } from '@workspace/db/db-preference-update-by-key'
import { toastError } from '@workspace/ui/lib/toast-error'

export type DbPreferenceCreateMutateOptions = MutateOptions<string, Error, { input: PreferenceInputCreate }>
export type DbPreferenceUpdateMutateOptions = MutateOptions<number, Error, { input: PreferenceInputUpdate }>

export const dbPreferenceOptions = {
  create: (props: DbPreferenceCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: PreferenceInputCreate }) => dbPreferenceCreate(db, input),
      onError: () => toastError('Error creating preference'),
      ...props,
    }),
  findUniqueByKey: (key: PreferenceKey) =>
    queryOptions({
      queryFn: () => dbPreferenceFindUniqueByKey(db, key),
      queryKey: ['dbPreferenceFindUniqueByKey', key],
    }),
  updateByKey: (key: PreferenceKey, props: DbPreferenceUpdateMutateOptions) =>
    mutationOptions({
      mutationFn: ({ input }: { input: PreferenceInputUpdate }) => dbPreferenceUpdateByKey(db, key, input),
      onError: () => toastError('Error updating preference'),
      ...props,
    }),
}
