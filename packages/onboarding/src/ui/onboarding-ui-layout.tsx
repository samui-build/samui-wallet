import { UiContainer } from '@workspace/ui/components/ui-container'
import { Outlet } from 'react-router'

export function OnboardingUiLayout() {
  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <UiContainer>
        <Outlet />
      </UiContainer>
    </div>
  )
}
