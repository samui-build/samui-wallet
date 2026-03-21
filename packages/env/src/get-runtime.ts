import { browser } from '@wxt-dev/browser'

export type Runtime = 'cli' | 'extension' | 'mobile' | 'web'

export function getRuntime(): Runtime {
  if (typeof process !== 'undefined' && process.versions) {
    return 'cli'
  }

  if (browser?.runtime) {
    return 'extension'
  }

  if (typeof window !== 'undefined' && 'expo' in window) {
    return 'mobile'
  }

  if (typeof document !== 'undefined' && document) {
    return 'web'
  }

  throw new Error('Unable to determine environment')
}

export function isCli(): boolean {
  return getRuntime() === 'cli'
}

export function isExtension(): boolean {
  return getRuntime() === 'extension'
}

export function isMobile(): boolean {
  return getRuntime() === 'mobile'
}

export function isWeb(): boolean {
  return getRuntime() === 'web'
}
