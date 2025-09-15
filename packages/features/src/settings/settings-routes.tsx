import { useRoutes } from 'react-router'
import { SettingsFeatureIndex } from './settings-feature-index.js'

export default function SettingsRoutes() {
  return useRoutes([
    //
    { index: true, element: <SettingsFeatureIndex /> },
  ])
}
