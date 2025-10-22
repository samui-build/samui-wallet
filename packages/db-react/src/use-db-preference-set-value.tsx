import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { useMutation } from '@tanstack/react-query'

import type { DbPreferenceSetValueMutateOptions } from './db-preference-options'

import { dbPreferenceOptions } from './db-preference-options'

export function useDbPreferenceSetValue(key: PreferenceKey, props: DbPreferenceSetValueMutateOptions = {}) {
  return useMutation(dbPreferenceOptions.setValue(key, props))
}
