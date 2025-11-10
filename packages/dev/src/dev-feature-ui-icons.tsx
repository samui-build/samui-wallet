import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { getIconNames } from '@workspace/ui/components/ui-icon-map'

export function DevFeatureUiIcons() {
  return (
    <UiCard title="ui icons">
      <div className="grid gap-4 grid-cols-6 justify-items-center">
        {getIconNames().map((name) => (
          <div className="flex flex-col items-center" key={name}>
            <UiIcon icon={name} />
            <span className="text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
    </UiCard>
  )
}
