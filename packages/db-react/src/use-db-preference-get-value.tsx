import { useQuery } from '@tanstack/react-query'
import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { dbPreferenceOptions } from './db-preference-options.tsx'

export function useDbPreferenceGetValue(key: PreferenceKey) {
  return useQuery(dbPreferenceOptions.getValue(key))
}
