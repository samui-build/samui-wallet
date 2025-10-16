import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { DbPreferenceUpdateMutateOptions } from './db-preference-options'

import { dbPreferenceOptions } from './db-preference-options'

export function useDbPreferenceUpdateByKey(key: PreferenceKey, props: DbPreferenceUpdateMutateOptions = {}) {
  const client = useQueryClient()
  const options = dbPreferenceOptions.updateByKey(key, props)
  return useMutation({
    ...options,
    onSuccess: async (...onSuccessProps) => {
      if (options.onSuccess) {
        options.onSuccess(...onSuccessProps)
      }
      await client.invalidateQueries({
        queryKey: dbPreferenceOptions.findUniqueByKey(key).queryKey,
      })
    },
  })
}
