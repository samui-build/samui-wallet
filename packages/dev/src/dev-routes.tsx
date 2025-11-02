import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'

import { devFeatures } from './dev-features.js'

export default function DevRoutes() {
  return <UiTabRoutes basePath="/dev" className="mt-2 mb-4 lg:mb-6" tabs={devFeatures} />
}
