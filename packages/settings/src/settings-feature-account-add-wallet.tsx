import type { Account } from '@workspace/db/entity/account'

import { useDbAccountFindUnique } from '@workspace/db-react/use-db-account-find-unique'
import { useDbWalletCreate } from '@workspace/db-react/use-db-wallet-create'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { importKeyPairToPublicKeySecretKey } from '@workspace/keypair/import-key-pair-to-public-key-secret-key'
import { assertIsAddress } from '@workspace/solana-client'
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

import { useDeriveAndCreateWallet } from './data-access/use-derive-and-create-wallet.js'
import { SettingsUiAccountItem } from './ui/settings-ui-account-item.js'
import { WalletUiIcon } from './ui/wallet-ui-icon.js'

export function SettingsFeatureAccountAddWallet() {
  const { accountId } = useParams() as { accountId: string }
  const { data: item, error, isError, isLoading } = useDbAccountFindUnique({ id: accountId })
  const deriveWallet = useDeriveAndCreateWallet()
  const createWalletMutation = useDbWalletCreate()
  const wallets = useDbWalletLive({ accountId })

  async function createWalletDerived(account: Account) {
    try {
      await deriveWallet.mutateAsync({ index: wallets?.length ?? 0, item: account })
      toastSuccess(`Wallet derived for ${account.name}`)
    } catch (e) {
      toastError(`${e}`)
    }
  }

  async function createWalletImported(accountId: string) {
    const input = window.prompt('What is the secret key you want to import?')
    if (!input?.trim().length) {
      return
    }
    try {
      const { publicKey, secretKey } = await importKeyPairToPublicKeySecretKey(input)
      assertIsAddress(publicKey)
      await createWalletMutation.mutateAsync({
        input: { accountId, name: ellipsify(publicKey), publicKey, secretKey, type: 'Imported' },
      })
      toastSuccess(`Wallet imported for ${item?.name}`)
    } catch (e) {
      toastError(`${e}`)
    }
  }

  async function createWalletWatched(accountId: string) {
    const publicKey = window.prompt('What is the public key you want to watch?')
    if (!publicKey?.trim().length) {
      return
    }
    try {
      assertIsAddress(publicKey)
      await createWalletMutation.mutateAsync({
        input: { accountId, name: ellipsify(publicKey), publicKey, type: 'Watched' },
      })
      toastSuccess(`Wallet watched for ${item?.name}`)
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
      backButtonTo={`/settings/accounts/${item.id}`}
      description="Add new wallets to this account"
      title={<SettingsUiAccountItem item={item} />}
    >
      <div className="space-y-6">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <WalletUiIcon type="Derived" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Derive a wallet</ItemTitle>
            <ItemDescription>Derive a wallet from the Account&#39;s mnemonic</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={() => createWalletDerived(item)} size="sm" variant="outline">
              Derive
            </Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <WalletUiIcon type="Imported" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Import a wallet</ItemTitle>
            <ItemDescription>Import a wallet from a base85 secret key or byte array</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={() => createWalletImported(item.id)} size="sm" variant="outline">
              Import
            </Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <WalletUiIcon type="Watched" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Watch a wallet</ItemTitle>
            <ItemDescription>Watch a wallet by public key without importing a secret</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={() => createWalletWatched(item.id)} size="sm" variant="outline">
              Watch
            </Button>
          </ItemActions>
        </Item>
      </div>
    </UiCard>
  )
}
