import { Outlet } from 'react-router'

export function RequestUiLayout() {
  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <div className="w-full max-w-lg px-2 sm:px-0">
        <Outlet />
      </div>
    </div>
  )
}
