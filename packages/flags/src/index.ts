export const FEATURES = {
  developerMode: process.env.NODE_ENV === 'development',
} as const

export type FeatureKey = keyof typeof FEATURES

export function isEnabled(key: FeatureKey): boolean {
  return FEATURES[key]
}
