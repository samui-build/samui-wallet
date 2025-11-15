import { useRoutes } from 'react-router'
import { OnboardingFeatureComplete } from './onboarding-feature-complete.tsx'
import { OnboardingFeatureGenerate } from './onboarding-feature-generate.tsx'
import { OnboardingFeatureImport } from './onboarding-feature-import.tsx'
import { OnboardingFeatureIndex } from './onboarding-feature-index.tsx'
import { OnboardingUiLayout } from './ui/onboarding-ui-layout.tsx'

export default function OnboardingRoutes({ redirectTo }: { redirectTo: string }) {
  return useRoutes([
    {
      children: [
        { element: <OnboardingFeatureIndex />, index: true },
        { element: <OnboardingFeatureGenerate redirectTo={redirectTo} />, path: 'generate' },
        { element: <OnboardingFeatureImport redirectTo={redirectTo} />, path: 'import' },
        { element: <OnboardingFeatureComplete />, path: 'complete' },
      ],
      element: <OnboardingUiLayout />,
    },
  ])
}
