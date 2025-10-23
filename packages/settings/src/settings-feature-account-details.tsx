import { useDbAccountFindUnique } from '@workspace/db-react/use-db-account-find-unique'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useParams } from 'react-router'

import { useActiveWallet } from './data-access/use-active-wallet.js'
import { useDeriveAndCreateWallet } from './data-access/use-derive-and-create-wallet.js'
import { SettingsUiAccountItem } from './ui/settings-ui-account-item.js'
import { SettingsUiWalletTable } from './ui/settings-ui-wallet-table.js'

export function SettingsFeatureAccountDetails() {
  const { accountId } = useParams() as { accountId: string }
  const { data: item, error, isError, isLoading } = useDbAccountFindUnique({ id: accountId })
  const { active, setActive } = useActiveWallet()
  const wallets = useDbWalletLive({ accountId })
  const deriveWallet = useDeriveAndCreateWallet()

  if (isLoading) {
    return <UiLoader />
  }
  if (isError) {
    return <UiError message={error} />
  }
  if (!item) {
    return <UiNotFound />
  }

  return (
    <UiCard
      title={
        <div className="flex items-center gap-2">
          <UiBack />
          <SettingsUiAccountItem item={item} />
        </div>
      }
    >
      <SettingsUiWalletTable
        active={active}
        deriveWallet={async () => {
          await deriveWallet.mutateAsync({ index: wallets?.length ?? 0, item })
        }}
        items={wallets ?? []}
        setActive={setActive}
      />
    </UiCard>
  )
}
