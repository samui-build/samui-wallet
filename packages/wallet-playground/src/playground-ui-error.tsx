import {
  isWalletStandardError,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED,
} from '@wallet-standard/core'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import type { ReactNode } from 'react'

export function PlaygroundUiError({ error, title }: { error: unknown; title?: string }) {
  return (
    <Alert>
      <AlertTitle className="text-red-500">{title ?? 'We encountered the following error'}</AlertTitle>
      <AlertDescription>{getErrorMessage(error, 'Unknown error occurred')}</AlertDescription>
    </Alert>
  )
}

export function getErrorMessage(err: unknown, fallbackMessage: ReactNode): ReactNode {
  if (isWalletStandardError(err, WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED)) {
    return (
      <div>
        This account does not support the <code>{err.context.featureName}</code> feature
      </div>
    )
  }
  if (isWalletStandardError(err, WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED)) {
    return (
      <div>
        The wallet '{err.context.walletName}' does not support the <code>{err.context.featureName}</code> feature.
      </div>
    )
  }
  if (isWalletStandardError(err, WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED)) {
    return (
      <div className="flex flex-col gap-4">
        <p>
          This account does not support the chain <code>{err.context.chain}</code>.
        </p>
        <p>
          Chains supported:
          <ul>
            {err.context.supportedChains.sort().map((chain) => (
              <li key={chain}>
                <code>{chain}</code>
              </li>
            ))}
          </ul>
        </p>
      </div>
    )
  }
  if (err && typeof err === 'object' && 'message' in err) {
    return String(err.message)
  }
  return fallbackMessage
}
