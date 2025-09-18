import { useRoutes } from 'react-router'
import { SettingsFeatureIndex } from './settings-feature-index.js'
import { SettingsFeatureDetail } from './settings-feature-detail.js'

export default function SettingsRoutes() {
  return useRoutes([
    { index: true, element: <SettingsFeatureIndex /> },
    { path: ':groupId', element: <SettingsFeatureDetail /> },
  ])
}
