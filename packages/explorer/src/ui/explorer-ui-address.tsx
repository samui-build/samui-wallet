import type { Address } from '@solana/kit'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

export function ExplorerUiAddress({ address }: { address: Address }) {
  return (
    <>
      <span className="hidden lg:block">{address}</span>
      <span className="lg:hidden" title={address}>
        {ellipsify(address, 6, '...')}
      </span>
    </>
  )
}
