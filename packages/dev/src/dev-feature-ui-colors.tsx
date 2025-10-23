import { UiCard } from '@workspace/ui/components/ui-card'
import { getColorByName, uiColorNames } from '@workspace/ui/lib/get-initials-colors'

export function DevFeatureUiColors() {
  return (
    <UiCard title="ui colors">
      <div className="grid gap-4 grid-cols-4">
        {uiColorNames.map((uiColorName) => {
          const { bg, text } = getColorByName(uiColorName)
          return (
            <div className={`${bg} ${text} aspect-square flex justify-center items-center`} key={uiColorName}>
              {uiColorName}
            </div>
          )
        })}
      </div>
    </UiCard>
  )
}
