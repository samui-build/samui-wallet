import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { Navigate, useParams } from 'react-router'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureAccountRedirect({ basePath }: { basePath: string }) {
  const { address } = useParams()
  if (!address || !solanaAddressSchema.safeParse(address).success) {
    return <ExplorerUiErrorPage message="The provided address is not a valid Solana address." title="Invalid address" />
  }

  return <Navigate replace to={`${basePath}/address/${address}`} />
}
