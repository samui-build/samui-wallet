import { assertIsAddress } from '@solana/kit'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { useDbAccountCreate } from '@workspace/db-react/use-db-account-create'
import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbWalletFindUnique } from '@workspace/db-react/use-db-wallet-find-unique'
import { importKeyPairToPublicKeySecretKey } from '@workspace/keypair/import-key-pair-to-public-key-secret-key'
import { Button } from '@workspace/ui/components/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useParams } from 'react-router'

import { useDeriveAndCreateAccount } from './data-access/use-derive-and-create-account.tsx'
import { AccountUiIcon } from './ui/account-ui-icon.tsx'
import { SettingsUiWalletItem } from './ui/settings-ui-wallet-item.tsx'

export function SettingsFeatureWalletAddAccount() {
  const { walletId } = useParams() as { walletId: string }
  const { data: item, error, isError, isLoading } = useDbWalletFindUnique({ id: walletId })
  const deriveAccount = useDeriveAndCreateAccount()
  const createAccountMutation = useDbAccountCreate()
  const accounts = useDbAccountLive({ walletId })

  async function createAccountDerived(wallet: Wallet) {
    try {
      await deriveAccount.mutateAsync({ index: accounts?.length ?? 0, item: wallet })
      toastSuccess(`Account derived for ${wallet.name}`)
    } catch (e) {
      toastError(`${e}`)
    }
  }

  async function createAccountImported(walletId: string) {
    const input = window.prompt('What is the secret key you want to import?')
    if (!input?.trim().length) {
      return
    }
    try {
      const { publicKey, secretKey } = await importKeyPairToPublicKeySecretKey(input, true)
      assertIsAddress(publicKey)
      await createAccountMutation.mutateAsync({
        input: { name: ellipsify(publicKey), publicKey, secretKey, type: 'Imported', walletId },
      })
      toastSuccess(`Account imported for ${item?.name}`)
    } catch (e) {
      toastError(`${e}`)
    }
  }

  async function createAccountWatched(walletId: string) {
    const publicKey = window.prompt('What is the public key you want to watch?')
    if (!publicKey?.trim().length) {
      return
    }
    try {
      assertIsAddress(publicKey)
      await createAccountMutation.mutateAsync({
        input: { name: ellipsify(publicKey), publicKey, type: 'Watched', walletId },
      })
      toastSuccess(`Account watched for ${item?.name}`)
    } catch (e) {
      toastError(`${e}`)
    }
  }

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
      backButtonTo={`/settings/wallets/${item.id}`}
      description="Add a new account to this wallet"
      title={<SettingsUiWalletItem item={item} />}
    >
      <div className="space-y-6">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <AccountUiIcon type="Derived" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Derive an account</ItemTitle>
            <ItemDescription>Derive an account from the Wallet&#39;s mnemonic</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={() => createAccountDerived(item)} size="sm" variant="outline">
              Derive
            </Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <AccountUiIcon type="Imported" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Import an account</ItemTitle>
            <ItemDescription>Import an account from a base85 secret key or byte array</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={() => createAccountImported(item.id)} size="sm" variant="outline">
              Import
            </Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <AccountUiIcon type="Watched" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Watch an account</ItemTitle>
            <ItemDescription>Watch an account by public key without importing a secret</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={() => createAccountWatched(item.id)} size="sm" variant="outline">
              Watch
            </Button>
          </ItemActions>
        </Item>
      </div>
    </UiCard>
  )
}
