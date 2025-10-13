import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useMemo } from 'react'

import { determineAccountName } from './determine-account-name.js'

export function useDetermineAccountName() {
  const items = useDbAccountLive()

  return useMemo(() => determineAccountName(items), [items])
}
