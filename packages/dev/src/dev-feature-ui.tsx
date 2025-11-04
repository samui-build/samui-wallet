import { DevFeatureUiAvatars } from './dev-feature-ui-avatars.tsx'
import { DevFeatureUiColors } from './dev-feature-ui-colors.tsx'

export default function DevFeatureUi() {
  return (
    <div className="space-y-6">
      <DevFeatureUiAvatars />
      <DevFeatureUiColors />
    </div>
  )
}
