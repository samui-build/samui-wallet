import { useDbAccountFindUnique } from '@workspace/db-react/use-db-account-find-unique'
import { useDbWalletCreate } from '@workspace/db-react/use-db-wallet-create'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { importKeyPairToPublicKeySecretKey } from '@workspace/keypair/import-key-pair-to-public-key-secret-key'
import { assertIsAddress } from '@workspace/solana-client'
import { Button } from '@workspace/ui/components/button'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { LucidePencil } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { useActiveWallet } from './data-access/use-active-wallet.js'
import { useDeriveAndCreateWallet } from './data-access/use-derive-and-create-wallet.js'
import { useSortWallets } from './data-access/use-sort-wallets.js'
import { SettingsUiAccountItem } from './ui/settings-ui-account-item.js'
import { SettingsUiWalletTable } from './ui/settings-ui-wallet-table.js'

export function SettingsFeatureAccountDetails() {
  const { accountId } = useParams() as { accountId: string }
  const { data: item, error, isError, isLoading } = useDbAccountFindUnique({ id: accountId })
  const { active, setActive } = useActiveWallet()
  const deriveWallet = useDeriveAndCreateWallet()
  const createWalletMutation = useDbWalletCreate()
  const wallets = useDbWalletLive({ accountId })
  const sorted = useSortWallets(wallets)

  async function createWalletImported(accountId: string) {
    const input = window.prompt('What is the secret key you want to import?')
    if (!input?.trim().length) {
      return
    }
    const { publicKey, secretKey } = await importKeyPairToPublicKeySecretKey(input)
    assertIsAddress(publicKey)
    await createWalletMutation.mutateAsync({
      input: { accountId, name: ellipsify(publicKey), publicKey, secretKey, type: 'Imported' },
    })
  }

  async function createWalletWatched(accountId: string) {
    const publicKey = window.prompt('What is the public key you want to watch?')
    if (!publicKey?.trim().length) {
      return
    }
    assertIsAddress(publicKey)
    await createWalletMutation.mutateAsync({
      input: { accountId, name: ellipsify(publicKey), publicKey, type: 'Watched' },
    })
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
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UiBack />
            <SettingsUiAccountItem item={item} />
          </div>
          <UiTooltip content="Edit account">
            <Button asChild size="icon" variant="outline">
              <Link to={`./edit`}>
                <LucidePencil className="size-4" />
              </Link>
            </Button>
          </UiTooltip>
        </div>
      }
    >
      <SettingsUiWalletTable
        active={active}
        deriveWallet={async () => {
          await deriveWallet.mutateAsync({ index: wallets?.length ?? 0, item })
        }}
        importWallet={async () => {
          await createWalletImported(item.id)
        }}
        items={sorted}
        setActive={setActive}
        watchWallet={async () => {
          await createWalletWatched(item.id)
        }}
      />
    </UiCard>
  )
}
