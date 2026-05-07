import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import type { AppContext } from '@workspace/db/app-context'
import { settingFindMany } from '@workspace/db/setting/setting-find-many'
import type { SettingFindManyInput } from '@workspace/db/setting/setting-find-many-input'
import type { SettingKey } from '@workspace/db/setting/setting-key'
import { settingSetValue } from '@workspace/db/setting/setting-set-value'
import { toastError } from '@workspace/ui/lib/toast-error'
import { queryClient } from './query-client.tsx'

export type SettingSetValueMutateOptions = MutateOptions<void, Error, string>

export const optionsSetting = {
  findMany: (ctx: AppContext, input: SettingFindManyInput) =>
    queryOptions({
      queryFn: () => settingFindMany(ctx, input),
      queryKey: ['settingFindMany', input],
    }),
  update: (ctx: AppContext, key: SettingKey, props: SettingSetValueMutateOptions = {}) =>
    mutationOptions({
      mutationFn: (value: string) => settingSetValue(ctx, key, value),
      onError: () => toastError('Error setting value'),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.findMany(ctx, {}))
      },
      ...props,
    }),
}
