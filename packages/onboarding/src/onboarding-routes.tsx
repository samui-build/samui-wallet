import { useRoutes } from 'react-router'

import { OnboardingFeatureGenerate } from './onboarding-feature-generate.tsx'
import { OnboardingFeatureImport } from './onboarding-feature-import.tsx'
import { OnboardingFeatureIndex } from './onboarding-feature-index.tsx'
import { OnboardingUiLayout } from './ui/onboarding-ui-layout.tsx'

export default function OnboardingRoutes() {
  return useRoutes([
    {
      children: [
        { element: <OnboardingFeatureIndex />, index: true },
        { element: <OnboardingFeatureGenerate />, path: 'generate' },
        { element: <OnboardingFeatureImport />, path: 'import' },
      ],
      element: <OnboardingUiLayout />,
    },
  ])
}
