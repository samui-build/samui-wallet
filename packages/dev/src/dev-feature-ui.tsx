import { DevFeatureUiAvatars } from './dev-feature-ui-avatars.js'
import { DevFeatureUiColors } from './dev-feature-ui-colors.js'
import { DevFeatureUiMenu } from './dev-feature-ui-menu.js'

export default function DevFeatureUi() {
  return (
    <div className="space-y-6">
      <DevFeatureUiMenu />
      <DevFeatureUiAvatars />
      <DevFeatureUiColors />
    </div>
  )
}
