import type { ReactNode } from 'react'

import { cn } from '@workspace/ui/lib/utils'

import type { ExtensionFooterProps } from './extension-footer'
import type { ExtensionHeaderProps } from './extension-header'

import { ExtensionFooter } from './extension-footer'
import { ExtensionHeader, extensionHeaderLinkOptions } from './extension-header'

export function ExtensionLayout({
  children,
  className = '',
  footer,
  header = {
    links: [extensionHeaderLinkOptions],
    title: <div className="text-lg pl-2">Samui</div>,
  },
}: {
  children: ReactNode
  className?: string
  footer?: ExtensionFooterProps | false
  header?: ExtensionHeaderProps | false
}) {
  return (
    <div className={cn('flex flex-col items-stretch justify-between h-full', className)}>
      {header === false ? null : <ExtensionHeader {...header} />}
      <main className="flex-1 min-h-0 overflow-auto">{children}</main>
      {footer === false ? null : <ExtensionFooter {...footer} />}
    </div>
  )
}
