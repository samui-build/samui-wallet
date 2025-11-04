import type { Tool } from '../tools.tsx'

import { ToolsUiOverviewItem } from './tools-ui-overview-item.tsx'

export function ToolsUiOverview({ tools }: { tools: Tool[] }) {
  return (
    <div className="space-y-6">
      {tools.map((tool) => (
        <ToolsUiOverviewItem key={tool.path} tool={tool} />
      ))}
    </div>
  )
}
