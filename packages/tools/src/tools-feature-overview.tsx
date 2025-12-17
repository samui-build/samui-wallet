import { tools } from './tools.tsx'
import { ToolsUiOverview } from './ui/tools-ui-overview.tsx'

export default function ToolsFeatureOverview() {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 md:gap-4">
      <ToolsUiOverview tools={tools} />
    </div>
  )
}
