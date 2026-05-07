import { DevFeatureUiAvatars } from './dev-feature-ui-avatars.tsx'
import { DevFeatureUiColors } from './dev-feature-ui-colors.tsx'
import { DevFeatureUiIcons } from './dev-feature-ui-icons.tsx'
import { DevFeatureUiInputs } from './dev-feature-ui-inputs.tsx'
import { DevFeatureUiToasts } from './dev-feature-ui-toasts.tsx'

export default function DevFeatureUi() {
  return (
    <div className="space-y-6">
      <DevFeatureUiToasts />
      <DevFeatureUiInputs />
      <DevFeatureUiIcons />
      <DevFeatureUiAvatars />
      <DevFeatureUiColors />
    </div>
  )
}
