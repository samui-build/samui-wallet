import type { Address } from '@solana/kit'
import { UiTextCopyIcon } from '@workspace/ui/components/ui-text-copy-icon'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { Link, useLocation } from 'react-router'

export function ExplorerUiLinkAddress({ basePath, address }: { basePath: string; address: Address }) {
  const { pathname: from } = useLocation()
  return (
    <span className="flex items-center gap-2">
      <Link
        className="cursor-pointer font-mono text-sm"
        state={{ from }}
        title={address}
        to={`${basePath}/address/${address}`}
      >
        {ellipsify(address, 8)}
      </Link>
      <UiTextCopyIcon text={address} title="Copy address to clipboard" toast="Address copied to clipboard" />
    </span>
  )
}
