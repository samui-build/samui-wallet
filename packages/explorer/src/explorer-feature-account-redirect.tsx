import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { Navigate, useLocation, useParams } from 'react-router'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureAccountRedirect({ basePath }: { basePath: string }) {
  const location = useLocation()
  const { address } = useParams<{ address: string }>()
  if (!address || !solanaAddressSchema.safeParse(address).success) {
    return <ExplorerUiErrorPage message="The provided address is not a valid Solana address." title="Invalid address" />
  }

  return <Navigate replace state={location.state} to={`${basePath}/address/${address}`} />
}
