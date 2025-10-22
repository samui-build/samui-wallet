import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { useQuery } from '@tanstack/react-query'

import { dbPreferenceOptions } from './db-preference-options'

export function useDbPreferenceGetValue(key: PreferenceKey) {
  return useQuery(dbPreferenceOptions.getValue(key))
}
