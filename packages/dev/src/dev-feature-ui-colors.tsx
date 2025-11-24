import { UiCard } from '@workspace/ui/components/ui-card'
import { getColorByName, uiColorNames } from '@workspace/ui/lib/get-initials-colors'

export function DevFeatureUiColors() {
  return (
    <UiCard title="ui colors">
      <div className="grid grid-cols-4 gap-4">
        {uiColorNames.map((uiColorName) => {
          const { bg, text } = getColorByName(uiColorName)
          return (
            <div className={`${bg} ${text} flex aspect-square items-center justify-center`} key={uiColorName}>
              {uiColorName}
            </div>
          )
        })}
      </div>
    </UiCard>
  )
}
