import { tools } from './tools.tsx'
import { ToolsUiOverview } from './ui/tools-ui-overview.tsx'

export default function ToolsFeatureOverview() {
  return (
    <div className="space-y-6">
      <ToolsUiOverview tools={tools.filter((t) => !t.comingSoon)} />
      <ToolsUiOverview tools={tools.filter((t) => t.comingSoon)} />
    </div>
  )
}
