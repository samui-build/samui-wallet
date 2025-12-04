import { useMemo } from 'react'
import { useAccountLive } from './use-account-live.tsx'
import { useSetting } from './use-setting.tsx'

export function useAccountActive() {
  const [accountId] = useSetting('activeAccountId')
  const accountLive = useAccountLive()
  const account = useMemo(() => accountLive.find((item) => item.id === accountId), [accountId, accountLive])
  if (!account) {
    console.log(
      'accountLive',
      accountLive.map((a) => a.publicKey),
    )
    console.log(
      `Account ${accountId} not found in`,
      accountLive.map((a) => ({ id: a.id, publicKey: a.publicKey })),
    )
    throw new Error(
      `Account ${accountId} not found in ${accountLive.map((a) => ({ id: a.id, publicKey: a.publicKey }))}`,
    )
  }

  return account
}
