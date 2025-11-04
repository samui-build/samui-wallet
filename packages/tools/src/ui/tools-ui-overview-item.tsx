import { Badge } from '@workspace/ui/components/badge'
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { cn } from '@workspace/ui/lib/utils'
import { ChevronRightIcon } from 'lucide-react'
import { Link } from 'react-router'

import type { Tool } from '../tools.tsx'

export function ToolsUiOverviewItem({ tool }: { tool: Tool }) {
  return (
    <Item
      asChild
      className={cn({
        'text-muted-foreground': tool.comingSoon,
      })}
      key={tool.path}
      size="sm"
      variant="outline"
    >
      <Link to={tool.comingSoon ? '#' : tool.path}>
        <ItemMedia>
          <UiIcon className="size-8" icon={tool.icon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-xl">{tool.label}</ItemTitle>
        </ItemContent>
        <ItemActions>
          {tool.comingSoon ? <Badge variant="secondary">Coming soon</Badge> : <ChevronRightIcon className="size-4" />}
        </ItemActions>
      </Link>
    </Item>
  )
}
