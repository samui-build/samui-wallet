import { DevFeatureUiAvatars } from './dev-feature-ui-avatars.tsx'
import { DevFeatureUiColors } from './dev-feature-ui-colors.tsx'
import { DevFeatureUiIcons } from './dev-feature-ui-icons.tsx'

export default function DevFeatureUi() {
  return (
    <div className="space-y-6">
      <DevFeatureUiIcons />
      <DevFeatureUiAvatars />
      <DevFeatureUiColors />
    </div>
  )
}
