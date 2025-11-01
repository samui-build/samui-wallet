import { tools } from './tools.js'
import { ToolsUiOverview } from './ui/tools-ui-overview.js'

export default function ToolsFeatureOverview() {
  return (
    <div className="space-y-6 p-3">
      <ToolsUiOverview tools={tools.filter((t) => !t.comingSoon)} />
      <ToolsUiOverview tools={tools.filter((t) => t.comingSoon)} />
    </div>
  )
}
