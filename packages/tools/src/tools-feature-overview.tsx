import type { LucideIcon } from 'lucide-react'

import { ToolsUiOverview } from './ui/tools-ui-overview.tsx'

export interface Tool {
  comingSoon?: boolean
  icon: LucideIcon
  label: string
  path: string
}

import { tools } from './tools.tsx'

export default function ToolsFeatureOverview() {
  return (
    <div className="space-y-6 p-3">
      <ToolsUiOverview tools={tools.filter((t) => !t.comingSoon)} />
      <ToolsUiOverview tools={tools.filter((t) => t.comingSoon)} />
    </div>
  )
}
