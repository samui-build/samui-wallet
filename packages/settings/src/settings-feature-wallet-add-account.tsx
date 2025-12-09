import { assertIsAddress } from '@solana/kit'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { useAccountCreate } from '@workspace/db-react/use-account-create'
import { useAccountsForWalletLive } from '@workspace/db-react/use-accounts-for-wallet-live'
import { useWalletFindUnique } from '@workspace/db-react/use-wallet-find-unique'
import { useTranslation } from '@workspace/i18n'
import { importKeyPairToPublicKeySecretKey } from '@workspace/keypair/import-key-pair-to-public-key-secret-key'
import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { UiPrompt } from '@workspace/ui/components/ui-prompt'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { Link, useParams } from 'react-router'
import { useDeriveAndCreateAccount } from './data-access/use-derive-and-create-account.tsx'
import { AccountUiIcon } from './ui/account-ui-icon.tsx'
import { SettingsUiWalletItem } from './ui/settings-ui-wallet-item.tsx'

export function SettingsFeatureWalletAddAccount() {
  const { t } = useTranslation('settings')
  const { walletId } = useParams() as { walletId: string }
  const wallet = useWalletFindUnique({ id: walletId })
  const deriveAccount = useDeriveAndCreateAccount()
  const createAccountMutation = useAccountCreate()
  const accounts = useAccountsForWalletLive({ walletId })

  async function createAccountDerived(wallet: Wallet) {
    try {
      await deriveAccount.mutateAsync({ index: accounts?.length ?? 0, item: wallet })
      toastSuccess(`Account derived for ${wallet.name}`)
    } catch (e) {
      toastError(`${e}`)
    }
  }

  async function createAccountImported(walletId: string, input: string) {
    if (!input.trim().length) {
      return
    }
    try {
      const { publicKey, secretKey } = await importKeyPairToPublicKeySecretKey(input, true)
      assertIsAddress(publicKey)
      await createAccountMutation.mutateAsync({
        input: { name: ellipsify(publicKey), publicKey, secretKey, type: 'Imported', walletId },
      })
      toastSuccess(`Account imported for ${wallet?.name}`)
    } catch (e) {
      toastError(`${e}`)
    }
  }

  async function createAccountWatched(walletId: string, input: string) {
    if (!input.trim().length) {
      return
    }
    try {
      assertIsAddress(input)
      await createAccountMutation.mutateAsync({
        input: { name: ellipsify(input), publicKey: input, type: 'Watched', walletId },
      })
      toastSuccess(`Account watched for ${wallet?.name}`)
    } catch (e) {
      toastError(`${e}`)
    }
  }

  if (!wallet) {
    return <UiNotFound />
  }

  return (
    <UiCard
      backButtonTo={`/settings/wallets/${wallet.id}`}
      description={t(($) => $.walletPageAddAccountDescription)}
      title={<SettingsUiWalletItem item={wallet} />}
    >
      <div className="space-y-2 md:space-y-6">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <AccountUiIcon type="Derived" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{t(($) => $.walletAddAccountDeriveTitle)}</ItemTitle>
            <ItemDescription>{t(($) => $.walletAddAccountDeriveDescription)}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={() => createAccountDerived(wallet)} size="sm" variant="outline">
              {t(($) => $.actionDerive)}
            </Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <UiIcon className="size-4" icon="search" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Generate a vanity account</ItemTitle>
            <ItemDescription>Find a prefix or suffix match for this wallet</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button asChild size="sm" variant="outline">
              <Link to={`/settings/wallets/${wallet.id}/add/generate-vanity`}>Generate</Link>
            </Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <AccountUiIcon type="Imported" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{t(($) => $.walletAddAccountImportTitle)}</ItemTitle>
            <ItemDescription>{t(($) => $.walletAddAccountImportDescription)}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <UiPrompt
              action={(value) => createAccountImported(wallet.id, value)}
              actionLabel={t(($) => $.actionImport)}
              description={t(($) => $.walletAddAccountImportDescription)}
              label={t(($) => $.walletAddAccountImportLabel)}
              placeholder={t(($) => $.walletAddAccountImportPlaceholder)}
              title={t(($) => $.walletAddAccountImportTitle)}
              value=""
            >
              <Button size="sm" variant="outline">
                {t(($) => $.actionImport)}
              </Button>
            </UiPrompt>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <AccountUiIcon type="Watched" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{t(($) => $.walletAddAccountWatchTitle)}</ItemTitle>
            <ItemDescription>{t(($) => $.walletAddAccountWatchDescription)}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <UiPrompt
              action={(value) => createAccountWatched(wallet.id, value)}
              actionLabel={t(($) => $.actionWatch)}
              description={t(($) => $.walletAddAccountWatchDescription)}
              label={t(($) => $.walletAddAccountWatchLabel)}
              placeholder={t(($) => $.walletAddAccountWatchPlaceholder)}
              title={t(($) => $.walletAddAccountWatchTitle)}
              value=""
            >
              <Button size="sm" variant="outline">
                {t(($) => $.actionWatch)}
              </Button>
            </UiPrompt>
          </ItemActions>
        </Item>
      </div>
    </UiCard>
  )
}
