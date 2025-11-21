import { useWalletDelete } from '@workspace/db-react/use-wallet-delete'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { Link } from 'react-router'
import { useActiveWallet } from './data-access/use-active-wallet.tsx'
import { useSettingsPage } from './data-access/use-settings-page.tsx'
import { SettingsUiWalletCreateOptions } from './ui/settings-ui-wallet-create-options.tsx'
import { SettingsUiWalletList } from './ui/settings-ui-wallet-list.tsx'

export function SettingsFeatureWalletList() {
  const { t } = useTranslation('settings')
  const page = useSettingsPage({ pageId: 'wallets' })
  const deleteMutation = useWalletDelete({
    onError: () => toastError('Error deleting wallet'),
    onSuccess: () => toastSuccess('Wallet deleted'),
  })
  const { wallets, active } = useActiveWallet()

  return wallets.length ? (
    <UiCard
      action={
        <Button asChild variant="outline">
          <Link to="create">{t(($) => $.actionCreate)}</Link>
        </Button>
      }
      description={page.description}
      title={page.name}
    >
      <SettingsUiWalletList
        active={active}
        deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })}
        items={wallets}
      />
    </UiCard>
  ) : (
    <UiCard>
      <SettingsUiWalletCreateOptions />
    </UiCard>
  )
}
