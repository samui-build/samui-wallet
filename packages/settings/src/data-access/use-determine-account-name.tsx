import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useMemo } from 'react'

import { determineNextName } from './determine-next-name.js'

export function useDetermineAccountName() {
  const items = useDbAccountLive()

  return useMemo(() => determineNextName(items, 'Account'), [items])
}
