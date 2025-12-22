import type { Address } from '@solana/kit'
import { UiTextCopyIcon } from '@workspace/ui/components/ui-text-copy-icon'
import { cn } from '@workspace/ui/lib/utils'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { ExplorerUiAddress } from './explorer-ui-address.tsx'

export function ExplorerUiLinkAddress({
  address,
  className,
  label,
  basePath,
}: {
  address: Address
  className?: string | undefined
  label?: ReactNode | undefined
  basePath: string
}) {
  const { pathname: from } = useLocation()
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <Link className="cursor-pointer font-mono" state={{ from }} title={address} to={`${basePath}/address/${address}`}>
        {label ? label : <ExplorerUiAddress address={address} />}
      </Link>
      <UiTextCopyIcon text={address} title="Copy address to clipboard" toast="Address copied to clipboard" />
    </span>
  )
}
