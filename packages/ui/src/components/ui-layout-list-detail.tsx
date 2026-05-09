import type { ReactNode } from 'react'

import { useLocation } from 'react-router'

import { normalizePath } from '../lib/normalize-path.ts'
import { cn } from '../lib/utils.ts'
import { UiPage } from './ui-page.tsx'

export function UiLayoutListDetail({
  basePath,
  children,
  list,
}: {
  basePath: string
  children: ReactNode
  list: ReactNode
}) {
  const { pathname } = useLocation()
  const isIndex = normalizePath(pathname) === normalizePath(basePath)

  return (
    <UiPage>
      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-4 md:gap-y-4">
        <div className={cn({ 'hidden md:block': !isIndex })}>{list}</div>
        <div className={cn('md:col-span-2', { 'hidden md:block': isIndex })}>{children}</div>
      </div>
    </UiPage>
  )
}
