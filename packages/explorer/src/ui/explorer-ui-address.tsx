import type { Address } from '@solana/kit'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { ExplorerUiAddressHover } from './explorer-ui-address-hover.tsx'

export function ExplorerUiAddress({ address }: { address: Address }) {
  return (
    <ExplorerUiAddressHover address={address}>
      <span className="hidden lg:block">{address}</span>
      <span className="lg:hidden" title={address}>
        {ellipsify(address, 6, '...')}
      </span>
    </ExplorerUiAddressHover>
  )
}
