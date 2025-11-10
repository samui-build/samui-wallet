import { Navigate, useParams } from 'react-router'

export function ExplorerFeatureAccountRedirect({ basePath }: { basePath: string }) {
  // TODO: Validate if this address is valid
  const { address } = useParams() as { address: string }

  return <Navigate replace to={`${basePath}/address/${address}`} />
}
