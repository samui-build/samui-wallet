import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbAccountSetActive } from '@workspace/db-react/use-db-account-set-active'
import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useMemo } from 'react'

export function useActiveAccount() {
  const accounts = useDbAccountLive()
  const [activeId] = useDbPreference('activeAccountId')
  const { mutateAsync } = useDbAccountSetActive()
  const active = useMemo(() => accounts.find((c) => c.id === activeId) ?? null, [accounts, activeId])

  return {
    accounts,
    active,
    setActive: (id: string) => mutateAsync({ id }),
  }
}
