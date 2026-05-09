import { NavLink, useLocation } from 'react-router'
import { normalizePath } from '../lib/normalize-path.ts'
import { cn } from '../lib/utils.ts'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './item.tsx'
import { UiIcon } from './ui-icon.tsx'
import type { UiIconName } from './ui-icon-map.tsx'

export interface UiSideNavItem {
  description: string
  icon: UiIconName
  label: string
  path: string
}

export function UiSideNav({ basePath, items }: { basePath: string; items: UiSideNavItem[] }) {
  const { pathname } = useLocation()
  const isIndex = normalizePath(pathname) === normalizePath(basePath)

  return (
    <div className="flex flex-col gap-1 sm:gap-2 md:gap-4">
      {items.map((item, index) => (
        <UiSideNavLink basePath={basePath} isDefaultActive={isIndex && index === 0} item={item} key={item.path} />
      ))}
    </div>
  )
}

function UiSideNavLink({
  basePath,
  isDefaultActive,
  item,
}: {
  basePath: string
  isDefaultActive: boolean
  item: UiSideNavItem
}) {
  const path = resolvePath(basePath, item.path)

  return (
    <NavLink to={path}>
      {({ isActive }) => (
        <Item
          className={cn({ 'md:border-transparent md:bg-muted/50': isDefaultActive })}
          size="sm"
          variant={isActive ? 'muted' : 'outline'}
        >
          <ItemMedia>
            <UiIcon className="size-4 md:size-6" icon={item.icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="md:text-xl">{item.label}</ItemTitle>
            <ItemDescription>{item.description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <UiIcon className="size-4" icon="chevronRight" />
          </ItemActions>
        </Item>
      )}
    </NavLink>
  )
}

function resolvePath(basePath: string, path: string) {
  if (path.startsWith('/')) {
    return path
  }

  const normalizedBasePath = normalizePath(basePath)
  const relativePath = path.replace(/^\/+/, '')

  return normalizedBasePath === '/' ? `/${relativePath}` : `${normalizedBasePath}/${relativePath}`
}
