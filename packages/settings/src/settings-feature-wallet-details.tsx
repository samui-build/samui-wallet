import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbWalletFindUnique } from '@workspace/db-react/use-db-wallet-find-unique'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucidePencil, LucidePlus } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { useSortAccounts } from './data-access/use-sort-accounts.tsx'
import { SettingsUiAccountTable } from './ui/settings-ui-account-table.tsx'
import { SettingsUiWalletItem } from './ui/settings-ui-wallet-item.tsx'

export function SettingsFeatureWalletDetails() {
  const { walletId } = useParams() as { walletId: string }
  const { data: item, error, isError, isLoading } = useDbWalletFindUnique({ id: walletId })
  const accounts = useDbAccountLive({ walletId })
  const sorted = useSortAccounts(accounts)

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
      backButtonTo="/settings/wallets"
      title={
        <div className="w-full flex items-center justify-between">
          <SettingsUiWalletItem item={item} />
          <div className="flex items-center gap-2">
            <UiTooltip content="Edit wallet">
              <Button asChild variant="outline">
                <Link to={`./edit`}>
                  <LucidePencil className="size-4" />
                  Edit Wallet
                </Link>
              </Button>
            </UiTooltip>
            <UiTooltip content="Add account to this wallet">
              <Button asChild variant="outline">
                <Link to={`./add`}>
                  <LucidePlus className="size-4" />
                  Add Account
                </Link>
              </Button>
            </UiTooltip>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <SettingsUiAccountTable items={sorted} />
      </div>
    </UiCard>
  )
}
