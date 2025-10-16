import { useMutation } from '@tanstack/react-query'

import type { DbPreferenceCreateMutateOptions } from './db-preference-options'

import { dbPreferenceOptions } from './db-preference-options'

export function useDbPreferenceCreate(props: DbPreferenceCreateMutateOptions = {}) {
  return useMutation(dbPreferenceOptions.create(props))
}
