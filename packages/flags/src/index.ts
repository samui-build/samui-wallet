export const FEATURES = {
  walletLockUnlock: true,
} as const

export type FeatureKey = keyof typeof FEATURES

export function isEnabled(key: FeatureKey): boolean {
  return FEATURES[key]
}
