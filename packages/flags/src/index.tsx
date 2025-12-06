import { type JSX, type LazyExoticComponent, Suspense } from 'react'

export const FEATURES = {
  walletLockUnlock: true,
} as const

export type FeatureKey = keyof typeof FEATURES

export function isEnabled(key: FeatureKey): boolean {
  return FEATURES[key]
}

interface FlagProps {
  feature: FeatureKey
  children: LazyExoticComponent<() => JSX.Element>
}

export function Flag({ feature, children: Component }: FlagProps) {
  const enabled = isEnabled(feature)
  if (!enabled) {
    return
  }

  return (
    <Suspense>
      <Component />
    </Suspense>
  )
}

export function useFlag(feature: FeatureKey): boolean {
  return isEnabled(feature)
}
