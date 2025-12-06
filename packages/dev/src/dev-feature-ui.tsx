import { DevFeatureUiAvatars } from './dev-feature-ui-avatars.tsx'
import { DevFeatureUiColors } from './dev-feature-ui-colors.tsx'
import { DevFeatureUiIcons } from './dev-feature-ui-icons.tsx'
import { DevFeatureUiInputs } from './dev-feature-ui-inputs.tsx'

export default function DevFeatureUi() {
  return (
    <div className="space-y-6">
      <DevFeatureUiInputs />
      <DevFeatureUiIcons />
      <DevFeatureUiAvatars />
      <DevFeatureUiColors />
    </div>
  )
}
