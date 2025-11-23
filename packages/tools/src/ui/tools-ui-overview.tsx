import type { Tool } from '../tools.tsx'

import { ToolsUiOverviewItem } from './tools-ui-overview-item.tsx'

export function ToolsUiOverview({ tools }: { tools: Tool[] }) {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 md:gap-4">
      {tools.map((tool) => (
        <ToolsUiOverviewItem key={tool.path} tool={tool} />
      ))}
    </div>
  )
}
