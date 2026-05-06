import type { Address } from '@solana/kit'
import { programMap } from '@workspace/solana-client/program-map'
import { ExplorerUiAddress } from './explorer-ui-address.tsx'
import { ExplorerUiAddressHover } from './explorer-ui-address-hover.tsx'

export function ExplorerUiProgramLabel({ address }: { address: Address }) {
  const found = programMap.get(address)

  if (!found) {
    return <ExplorerUiAddress address={address} />
  }
  return (
    <ExplorerUiAddressHover address={address}>
      <span>{found}</span>
    </ExplorerUiAddressHover>
  )
}
