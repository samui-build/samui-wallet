import { useRoutes } from 'react-router'

import { SettingsFeatureDetail } from './settings-feature-detail.js'
import { SettingsFeatureIndex } from './settings-feature-index.js'

export default function SettingsRoutes() {
  return useRoutes([
    { element: <SettingsFeatureIndex />, index: true },
    { element: <SettingsFeatureDetail />, path: ':groupId' },
  ])
}
