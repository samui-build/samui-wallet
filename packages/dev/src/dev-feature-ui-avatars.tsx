import { UiAvatar } from '@workspace/ui/components/ui-avatar'
import { UiCard } from '@workspace/ui/components/ui-card'

export function DevFeatureUiAvatars() {
  return (
    <UiCard title="ui avatars">
      <div className="grid grid-cols-4 justify-items-center gap-4">
        <UiAvatar className="size-16" label="beeman" />
        <UiAvatar className="size-16" label="tobeycodes" />
        <UiAvatar className="size-16" label="beeman" src="https://github.com/beeman.png" />
        <UiAvatar className="size-16" label="tobeycodes" src="https://github.com/tobeycodes.png" />
      </div>
    </UiCard>
  )
}
