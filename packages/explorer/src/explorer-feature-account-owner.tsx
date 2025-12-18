import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import { ExplorerFeatureAccountOwnerToken } from './explorer-feature-account-owner-token.tsx'

export function ExplorerFeatureAccountOwner(props: {
  basePath: string
  address: Address
  owner: Address
  network: Network
}) {
  switch (props.owner.toString()) {
    case TOKEN_2022_PROGRAM_ADDRESS.toString():
    case TOKEN_PROGRAM_ADDRESS.toString():
      return <ExplorerFeatureAccountOwnerToken {...props} />
    default:
      return null
  }
}
