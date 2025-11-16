import { Outlet } from 'react-router'

export function OnboardingUiLayout() {
  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <div className="w-full px-2 sm:px-0 max-w-lg">
        <Outlet />
      </div>
    </div>
  )
}
