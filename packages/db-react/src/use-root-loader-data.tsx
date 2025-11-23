import { useRouteLoaderData } from 'react-router'
import type { RootLoaderData } from './root-loader.tsx'

export function useRootLoaderData() {
  return useRouteLoaderData<RootLoaderData>('root')
}
