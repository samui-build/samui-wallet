import { browser } from '@wxt-dev/browser'

export type Runtime = 'extension' | 'web'

export function getRuntime(): Runtime {
  if (browser?.runtime) {
    return 'extension'
  }

  if (typeof document !== 'undefined' && document) {
    return 'web'
  }

  throw new Error('Unable to determine environment')
}

export function isExtension(): boolean {
  return getRuntime() === 'extension'
}

export function isWeb(): boolean {
  return getRuntime() === 'web'
}
