import { UiTime } from '@workspace/ui/components/ui-time'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'

export function ExplorerUiTimestamp({ date }: { date: Date }) {
  return (
    <UiTooltip content={`${date.toLocaleString()}`}>
      <UiTime time={date} />
    </UiTooltip>
  )
}
