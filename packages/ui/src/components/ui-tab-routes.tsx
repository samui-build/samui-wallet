import type { ComponentProps, ReactElement, ReactNode } from 'react'

import { Fragment, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'

import { Tabs, TabsList, TabsTrigger } from './tabs.tsx'
import { UiLoader } from './ui-loader.tsx'

export interface UiTabRoute {
  element: ReactNode
  label: ReactElement | string
  path: string
}

export function UiTabRoutes({
  basePath,
  tabs,
  ...props
}: {
  basePath: string
  tabs: UiTabRoute[]
} & Omit<ComponentProps<typeof Tabs>, 'activationMode' | 'children' | 'onValueChange' | 'value'>) {
  const navigate = useNavigate()
  const location = useLocation()
  // Set the active tab based on matching the location pathname with the tab path
  const activeTab = tabs.find((tab) => location.pathname.startsWith(`${basePath}/${tab.path}`))?.path
  // Set default redirect route to the first tab
  const redirect = tabs[0]?.path !== '' ? tabs[0]?.path : undefined

  return (
    <>
      <Tabs
        activationMode="manual"
        onValueChange={(value) => navigate(`${basePath}/${value}`)}
        value={activeTab ?? ''}
        {...props}
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.path} value={tab.path}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Suspense fallback={<UiLoader />}>
        <Routes>
          {redirect && (
            <Fragment>
              <Route element={<Navigate replace to={`${basePath}/${redirect}`} />} index />
              {!activeTab && <Route element={<Navigate replace to={`${basePath}/${redirect}`} />} path="*" />}
            </Fragment>
          )}
          {tabs.map((tab) => (
            <Route element={tab.element} key={tab.path} path={`${tab.path}/*`} />
          ))}
        </Routes>
      </Suspense>
    </>
  )
}
