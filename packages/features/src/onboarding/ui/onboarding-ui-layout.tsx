import { Outlet } from 'react-router'

export function OnboardingUiLayout() {
  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <Outlet />
    </div>
  )
}
