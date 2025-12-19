import type { UiWallet } from '@wallet-standard/react'
import type { Network } from '@workspace/db/network/network'
import { ExplorerUiLinkSignature } from '@workspace/explorer/ui/explorer-ui-link-signature'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { createSolanaClient } from 'gill'
import { Fragment } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { PlaygroundUiError } from './playground-ui-error.tsx'
import { PlaygroundUiWalletAddress } from './playground-ui-wallet-address.tsx'
import { PlaygroundUiWalletConnect } from './playground-ui-wallet-connect.tsx'
import { PlaygroundUiWalletDisconnect } from './playground-ui-wallet-disconnect.tsx'
import {
  PlaygroundUiWalletFeatureSignAndSendTransaction
} from './playground-ui-wallet-feature-sign-and-send-transaction.tsx'
import { PlaygroundUiWalletFeatureSignIn } from './playground-ui-wallet-feature-sign-in.tsx'
import { PlaygroundUiWalletFeatureSignMessage } from './playground-ui-wallet-feature-sign-message.tsx'
import { PlaygroundUiWalletFeatureSignTransaction } from './playground-ui-wallet-feature-sign-transaction.tsx'
import { PlaygroundUiWalletOverview } from './playground-ui-wallet-overview.tsx'
import { WalletUiIcon } from './wallet-ui-icon.tsx'

export function PlaygroundFeatureWalletListItem({ network, wallet }: { network: Network; wallet: UiWallet }) {
  const client = createSolanaClient({ urlOrMoniker: network.endpoint })
  const connected = !!wallet.accounts?.length
  const account = wallet.accounts.length ? wallet.accounts[0] : undefined
  return (
    <div className="space-y-2 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <WalletUiIcon wallet={wallet} />
            <span>{wallet.name}</span>
          </CardTitle>
          <CardDescription>
            {connected && account?.address ? (
              <PlaygroundUiWalletAddress address={account?.address} />
            ) : (
              `Connect to ${wallet.name} to see the accounts`
            )}
          </CardDescription>
          <CardAction className="space-x-2">
            {connected ? (
              <PlaygroundUiWalletDisconnect wallet={wallet} />
            ) : (
              <PlaygroundUiWalletConnect wallet={wallet} />
            )}
          </CardAction>
        </CardHeader>
      </Card>
      <PlaygroundUiWalletOverview wallet={wallet} />
      {account ? (
        <Fragment>
          <ErrorBoundary fallbackRender={({ error }) => <PlaygroundUiError error={error} />} resetKeys={[wallet.name]}>
            <PlaygroundUiWalletFeatureSignIn
              account={account}
              network={network}
              onError={(err) => toastError('Error signing in', { description: `${err}` })}
              onSuccess={(account) =>
                toastSuccess('Signing in success', {
                  description: account?.address ? <PlaygroundUiWalletAddress address={account.address} /> : null,
                })
              }
              wallet={wallet}
            />
          </ErrorBoundary>
          <ErrorBoundary fallbackRender={({ error }) => <PlaygroundUiError error={error} />} resetKeys={[wallet.name]}>
            <PlaygroundUiWalletFeatureSignMessage
              account={account}
              onError={(err) => toastError('Error signing message', { description: `${err}` })}
              onSuccess={(signature) =>
                toastSuccess('Signing message success', {
                  description: signature ? <PlaygroundUiWalletAddress address={signature} len={10} /> : null,
                })
              }
              wallet={wallet}
            />
          </ErrorBoundary>
          <ErrorBoundary fallbackRender={({ error }) => <PlaygroundUiError error={error} />} resetKeys={[wallet.name]}>
            <PlaygroundUiWalletFeatureSignAndSendTransaction
              account={account}
              client={client}
              network={network}
              onError={(err) => toastError('Error signing and sending transaction', { description: `${err}` })}
              onSuccess={(signature) =>
                toastSuccess('Signing and sending transaction success', {
                  description: signature ? (
                    <ExplorerUiLinkSignature basePath="/explorer" signature={signature} />
                  ) : null,
                })
              }
              wallet={wallet}
            />
          </ErrorBoundary>
          <ErrorBoundary fallbackRender={({ error }) => <PlaygroundUiError error={error} />} resetKeys={[wallet.name]}>
            <PlaygroundUiWalletFeatureSignTransaction
              account={account}
              client={client}
              network={network}
              onError={(err) => toastError('Error signing transaction', { description: `${err}` })}
              onSuccess={(signature) =>
                toastSuccess('Signing transaction success', {
                  description: signature ? (
                    <ExplorerUiLinkSignature basePath="/explorer" signature={signature} />
                  ) : null,
                })
              }
              wallet={wallet}
            />
          </ErrorBoundary>
        </Fragment>
      ) : null}
    </div>
  )
}
