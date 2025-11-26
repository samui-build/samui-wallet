import type { Signature } from '@solana/kit'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

export function ExplorerUiSignature({ signature }: { signature: Signature }) {
  return (
    <>
      <span className="hidden lg:block">{ellipsify(signature, 16)}</span>
      <span className="lg:hidden" title={signature}>
        {ellipsify(signature, 8)}
      </span>
    </>
  )
}
