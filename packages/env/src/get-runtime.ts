import { browser } from '@wxt-dev/browser'

export type Runtime = 'cli' | 'desktop' | 'extension' | 'mobile' | 'web'

export function getRuntime(): Runtime {
  if (typeof process !== 'undefined' && process.versions) {
    return 'cli'
  }

  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    return 'desktop'
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

export function isDesktop(): boolean {
  return getRuntime() === 'desktop'
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
