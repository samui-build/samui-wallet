import { useAccountsForWalletLive } from '@workspace/db-react/use-accounts-for-wallet-live'
import { useWalletFindUnique } from '@workspace/db-react/use-wallet-find-unique'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { Link, useLocation, useParams } from 'react-router'
import { SettingsUiAccountTable } from './ui/settings-ui-account-table.tsx'
import { SettingsUiWalletItem } from './ui/settings-ui-wallet-item.tsx'

export function SettingsFeatureWalletDetails() {
  const { t } = useTranslation('settings')
  const { pathname: from } = useLocation()
  const { walletId } = useParams() as { walletId: string }
  const wallet = useWalletFindUnique({ id: walletId })
  const accounts = useAccountsForWalletLive({ walletId })

  if (!wallet) {
    return <UiNotFound />
  }

  return (
    <UiCard
      backButtonTo="/settings/wallets"
      title={
        <div className="flex w-full items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-2">
            <SettingsUiWalletItem item={wallet} />
            <Button asChild size="icon" title={t(($) => $.actionEditWallet)} variant="ghost">
              <Link state={{ from }} to={`./edit`}>
                <UiIcon className="size-4" icon="edit" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild title={t(($) => $.actionEditWalletMessage)} variant="outline">
              <Link to={`./add`}>
                <UiIcon className="size-4" icon="add" />
                {t(($) => $.actionAddAccount)}
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-2 md:space-y-6">
        <SettingsUiAccountTable items={accounts} />
      </div>
    </UiCard>
  )
}
