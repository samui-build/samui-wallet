import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { useQuery } from '@tanstack/react-query'

import { dbPreferenceOptions } from './db-preference-options'

export function useDbPreferenceFindUnique({ key }: { key: PreferenceKey }) {
  return useQuery(dbPreferenceOptions.findUniqueByKey(key))
}
