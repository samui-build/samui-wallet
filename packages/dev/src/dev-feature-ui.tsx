import { DevFeatureUiAvatars } from './dev-feature-ui-avatars.js'
import { DevFeatureUiColors } from './dev-feature-ui-colors.js'

export default function DevFeatureUi() {
  return (
    <div className="space-y-6">
      <DevFeatureUiAvatars />
      <DevFeatureUiColors />
    </div>
  )
}
