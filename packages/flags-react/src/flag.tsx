import type { FeatureKey } from '@workspace/flags'
import { type JSX, type LazyExoticComponent, Suspense } from 'react'
import { useFlag } from './use-flag.tsx'

interface FlagProps {
  feature: FeatureKey
  children: LazyExoticComponent<() => JSX.Element>
  fallback?: JSX.Element
}

export function Flag({ feature, children: Component, fallback }: FlagProps) {
  const enabled = useFlag(feature)
  if (!enabled) {
    return null
  }

  return (
    <Suspense fallback={fallback ?? null}>
      <Component />
    </Suspense>
  )
}
