import type { NetworkType } from '@workspace/db/entity/network-type'

import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { AlertTriangleIcon } from 'lucide-react'

export function SettingsUiNetworkWarningMainnet({ type }: { type?: NetworkType }) {
  if (!type || type !== 'solana:mainnet') {
    return null
  }

  return (
    <Alert variant="warning">
      <AlertTriangleIcon />
      <AlertTitle>This is experimental software.</AlertTitle>
      <AlertDescription>
        Use Mainnet at your own risk. This code is unaudited and unsupported. Do not use any real funds.
      </AlertDescription>
    </Alert>
  )
}
