import { useRoutes } from 'react-router'

import { OnboardingProvider } from './data-access/onboarding-provider.js'
import { OnboardingFeatureGenerate } from './onboarding-feature-generate.js'
import { OnboardingFeatureImport } from './onboarding-feature-import.js'
import { OnboardingFeatureIndex } from './onboarding-feature-index.js'
import { OnboardingUiLayout } from './ui/onboarding-ui-layout.js'

export default function OnboardingRoutes() {
  const routes = useRoutes([
    {
      children: [
        { element: <OnboardingFeatureIndex />, index: true },
        { element: <OnboardingFeatureGenerate />, path: 'generate' },
        { element: <OnboardingFeatureImport />, path: 'import' },
      ],
      element: <OnboardingUiLayout />,
    },
  ])

  return <OnboardingProvider>{routes}</OnboardingProvider>
}
