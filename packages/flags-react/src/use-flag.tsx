import { type FeatureKey, isEnabled } from '@workspace/flags'

export function useFlag(feature: FeatureKey): boolean {
  return isEnabled(feature)
}
