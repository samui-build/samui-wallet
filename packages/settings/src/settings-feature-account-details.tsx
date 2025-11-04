import { useDbAccountFindUnique } from '@workspace/db-react/use-db-account-find-unique'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { LucidePencil, LucidePlus } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { useSortWallets } from './data-access/use-sort-wallets.tsx'
import { SettingsUiAccountItem } from './ui/settings-ui-account-item.tsx'
import { SettingsUiWalletTable } from './ui/settings-ui-wallet-table.tsx'

export function SettingsFeatureAccountDetails() {
  const { accountId } = useParams() as { accountId: string }
  const { data: item, error, isError, isLoading } = useDbAccountFindUnique({ id: accountId })
  const wallets = useDbWalletLive({ accountId })
  const sorted = useSortWallets(wallets)

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
      backButtonTo="/settings/accounts"
      title={
        <div className="w-full flex items-center justify-between">
          <SettingsUiAccountItem item={item} />
          <div className="flex items-center gap-2">
            <UiTooltip content="Edit account">
              <Button asChild variant="outline">
                <Link to={`./edit`}>
                  <LucidePencil className="size-4" />
                  Edit Account
                </Link>
              </Button>
            </UiTooltip>
            <UiTooltip content="Add wallet to this account">
              <Button asChild variant="outline">
                <Link to={`./add`}>
                  <LucidePlus className="size-4" />
                  Add Wallet
                </Link>
              </Button>
            </UiTooltip>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <SettingsUiWalletTable items={sorted} />
      </div>
    </UiCard>
  )
}
