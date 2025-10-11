import type { ReactNode } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Cog } from 'lucide-react'

export interface ExtensionHeaderLink {
  icon: ReactNode
  page: string
  title: string
}
export const extensionHeaderLinkOptions: ExtensionHeaderLink = {
  icon: <Cog />,
  page: `options`,
  title: 'Options',
}

export interface ExtensionHeaderProps {
  links?: ExtensionHeaderLink[]
  profile?: ReactNode
  title?: ReactNode
}

export function ExtensionHeader({ links = [], profile = null, title = null }: ExtensionHeaderProps) {
  const origin = window.location.origin
  return (
    <header className="p-2 bg-muted/50 flex items-center justify-between">
      <div className="flex items-center gap-2">{title ? <div>{title}</div> : null}</div>
      <div className="flex items-center gap-2">
        {profile}
        {links.map(({ icon, page, title }) => {
          const href = `${origin}/${page}.html`
          return (
            <Button
              asChild
              key={page}
              size="icon"
              title={title}
              variant={window.location.href.startsWith(href) ? 'default' : 'outline'}
            >
              <a href={href} target={page}>
                {icon}
              </a>
            </Button>
          )
        })}
      </div>
    </header>
  )
}
