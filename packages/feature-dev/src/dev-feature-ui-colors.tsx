import { UiCard } from '@workspace/ui/components/ui-card'
import { getColorByName, uiColorNames } from '@workspace/ui/lib/get-initials-colors'
import { cn } from '@workspace/ui/lib/utils'

export function DevFeatureUiColors() {
  return (
    <UiCard title="ui colors">
      <div className="grid grid-cols-4 gap-4">
        {uiColorNames.map((uiColorName) => {
          const { bg, border, text } = getColorByName(uiColorName)
          return (
            <div
              className={cn('flex aspect-square items-center justify-center border-2', bg, border, text)}
              key={uiColorName}
            >
              {uiColorName}
            </div>
          )
        })}
      </div>
    </UiCard>
  )
}
