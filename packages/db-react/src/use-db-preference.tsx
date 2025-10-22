import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { useDbPreferenceGetValueLive } from './use-db-preference-get-value-live'
import { useDbPreferenceSetValue } from './use-db-preference-set-value'

export function useDbPreference(key: PreferenceKey): [null | string, (newValue: string) => Promise<void>] {
  const getValue = useDbPreferenceGetValueLive(key)
  const setValue = useDbPreferenceSetValue(key)

  return [getValue, (newValue: string) => setValue.mutateAsync(newValue)]
}
