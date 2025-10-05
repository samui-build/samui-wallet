import { OnboardingFeatureGenerate } from './onboarding-feature-generate.js'
import { useRoutes } from 'react-router'
import { OnboardingProvider } from './data-access/onboarding-provider.js'
import { OnboardingUiLayout } from './ui/onboarding-ui-layout.js'
import { OnboardingFeatureImport } from './onboarding-feature-import.js'
import { OnboardingFeatureIndex } from './onboarding-feature-index.js'

export default function OnboardingRoutes() {
  const routes = useRoutes([
    {
      element: <OnboardingUiLayout />,
      children: [
        { index: true, element: <OnboardingFeatureIndex /> },
        { path: 'generate', element: <OnboardingFeatureGenerate /> },
        { path: 'import', element: <OnboardingFeatureImport /> },
      ],
    },
  ])

  return <OnboardingProvider>{routes}</OnboardingProvider>
}
