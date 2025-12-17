import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'
import type { Tool } from '../tools.tsx'

export function ToolsUiOverviewItem({ tool }: { tool: Tool }) {
  return (
    <Item asChild key={tool.path} size="sm" variant="outline">
      <Link to={tool.path}>
        <ItemMedia>
          <UiIcon className="size-4 md:size-6" icon={tool.icon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="md:text-xl">{tool.label}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <UiIcon className="size-4" icon="chevronRight" />
        </ItemActions>
      </Link>
    </Item>
  )
}
