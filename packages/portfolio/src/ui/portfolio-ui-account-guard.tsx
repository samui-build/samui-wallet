import type { Account } from '@workspace/db/entity/account'
import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { type ReactNode, useMemo } from 'react'

export interface PortfolioUiAccountGuardProps {
  fallback?: ReactNode
  render: (props: { account: Account }) => ReactNode
}

export function PortfolioUiAccountGuard({
  fallback = <div>Account not selected</div>,
  render,
}: PortfolioUiAccountGuardProps) {
  const [accountId] = useDbSetting('activeAccountId')
  const [walletId] = useDbSetting('activeWalletId')
  const accountLive = useDbAccountLive({ walletId: walletId })

  const account = useMemo(() => accountLive.find((item) => item.id === accountId), [accountId, accountLive])

  return account ? render({ account }) : fallback
}
