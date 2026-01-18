import type { Address } from '@solana/kit'
import { ExplorerUiAddress } from './explorer-ui-address.tsx'
import { ExplorerUiAddressHover } from './explorer-ui-address-hover.tsx'
import { programMap } from './program-map.tsx'

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
