import type { Signature } from '@solana/kit'
import { UiTextCopyIcon } from '@workspace/ui/components/ui-text-copy-icon'
import { cn } from '@workspace/ui/lib/utils'
import { Link, useLocation } from 'react-router'

import { ExplorerUiSignature } from './explorer-ui-signature.tsx'

export function ExplorerUiLinkSignature({
  basePath,
  className,
  label,
  signature,
}: {
  basePath: string
  className?: string | undefined
  label?: string | undefined
  signature: Signature
}) {
  const { pathname: from } = useLocation()
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <Link
        className="cursor-pointer font-mono text-sm"
        state={{ from }}
        title={signature}
        to={`${basePath}/tx/${signature}`}
      >
        {label?.length ? label : <ExplorerUiSignature signature={signature} />}
      </Link>
      <UiTextCopyIcon text={signature} title="Copy signature to clipboard" toast="Signature copied to clipboard" />
    </span>
  )
}
