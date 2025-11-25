import type { Signature } from '@solana/kit'
import { UiTextCopyIcon } from '@workspace/ui/components/ui-text-copy-icon'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { Link, useLocation } from 'react-router'

export function ExplorerUiLinkTx({ basePath, signature }: { basePath: string; signature: Signature }) {
  const { pathname: from } = useLocation()
  return (
    <span className="flex items-center gap-2">
      <Link
        className="cursor-pointer font-mono text-sm"
        state={{ from }}
        title={signature}
        to={`${basePath}/tx/${signature}`}
      >
        {ellipsify(signature, 8)}
      </Link>
      <UiTextCopyIcon text={signature} title="Copy signature to clipboard" toast="Signature copied to clipboard" />
    </span>
  )
}
