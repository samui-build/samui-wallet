import { useAccountLive } from '@workspace/db-react/use-account-live'
import { useWalletFindUnique } from '@workspace/db-react/use-wallet-find-unique'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { Link, useParams } from 'react-router'
import { useSortAccounts } from './data-access/use-sort-accounts.tsx'
import { SettingsUiAccountTable } from './ui/settings-ui-account-table.tsx'
import { SettingsUiWalletItem } from './ui/settings-ui-wallet-item.tsx'

export function SettingsFeatureWalletDetails() {
  const { t } = useTranslation('settings')
  const { walletId } = useParams() as { walletId: string }
  const { data: item, error, isError, isLoading } = useWalletFindUnique({ id: walletId })
  const accounts = useAccountLive({ walletId })
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
        <div className="flex w-full items-center justify-between">
          <SettingsUiWalletItem item={item} />
          <div className="flex items-center gap-2">
            <UiTooltip content={t(($) => $.actionEditWallet)}>
              <Button asChild variant="outline">
                <Link to={`./edit`}>
                  <UiIcon className="size-4" icon="edit" />
                  {t(($) => $.actionEditWallet)}
                </Link>
              </Button>
            </UiTooltip>
            <UiTooltip content={t(($) => $.actionEditWalletMessage)}>
              <Button asChild variant="outline">
                <Link to={`./add`}>
                  <UiIcon className="size-4" icon="add" />
                  {t(($) => $.actionAddAccount)}
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
