import type { Tool } from '../tools.js'

import { ToolsUiOverviewItem } from './tools-ui-overview-item.js'

export function ToolsUiOverview({ tools }: { tools: Tool[] }) {
  return (
    <div className="space-y-6">
      {tools.map((tool) => (
        <ToolsUiOverviewItem key={tool.path} tool={tool} />
      ))}
    </div>
  )
}
