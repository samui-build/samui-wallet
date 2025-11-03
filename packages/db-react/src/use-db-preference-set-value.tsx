import { useMutation } from '@tanstack/react-query'
import type { PreferenceKey } from '@workspace/db/entity/preference-key'
import type { DbPreferenceSetValueMutateOptions } from './db-preference-options.tsx'
import { dbPreferenceOptions } from './db-preference-options.tsx'

export function useDbPreferenceSetValue(key: PreferenceKey, props: DbPreferenceSetValueMutateOptions = {}) {
  return useMutation(dbPreferenceOptions.setValue(key, props))
}
