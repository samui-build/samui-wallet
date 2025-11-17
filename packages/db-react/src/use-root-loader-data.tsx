import { useRouteLoaderData } from 'react-router'
import type { DbLoaderData } from './db-loader.tsx'

export function useRootLoaderData() {
  return useRouteLoaderData<DbLoaderData>('root')
}
