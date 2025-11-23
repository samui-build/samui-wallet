import type { Signature } from '@solana/kit'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { Link, useLocation } from 'react-router'

export function ExplorerUiLinkTx({ basePath, signature }: { basePath: string; signature: Signature }) {
  const { pathname: from } = useLocation()
  return (
    <span className="flex items-center gap-1">
      <Link
        className="text-sm font-mono cursor-pointer"
        state={{ from }}
        title={signature}
        to={`${basePath}/tx/${signature}`}
      >
        {ellipsify(signature, 8)}
      </Link>
      <UiTextCopyButton
        size="icon"
        text={signature}
        title="Copy signature to clipboard"
        toast="Signature copied to clipboard"
        variant="ghost"
      />
    </span>
  )
}
