import { useMemo } from 'react'
import { useAccountLive } from './use-account-live.tsx'
import { useSetting } from './use-setting.tsx'

export function useAccountActive() {
  const [accountId] = useSetting('activeAccountId')
  const accountLive = useAccountLive()
  const account = useMemo(() => {
    // 1. trying to find the account by ID
    const found = accountLive.find((item) => item.id === accountId)
    if (found) return found
    // 2. if not found then fallback to first account during transition states (race condition fix)
    return accountLive[0]
  }, [accountId, accountLive])
  if (!account) {
    throw new Error('No active account set.')
  }

  return account
}
