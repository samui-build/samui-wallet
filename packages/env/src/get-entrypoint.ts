import { getRuntime, type Runtime } from './get-runtime.ts'

export type Entrypoint = Exclude<Runtime, 'extension'> | 'onboarding' | 'popup' | 'request' | 'sidepanel'

export function getEntrypoint(): Entrypoint {
  const runtime = getRuntime()
  if (runtime !== 'extension') {
    return runtime
  }

  const href = window?.location?.href
  if (!href) {
    throw new Error('Window location is not available')
  }

  const entrypoint = href.match(/\/([^/]+)\.html/)?.[1]
  if (!entrypoint) {
    throw new Error('Unable to determine entrypoint from URL')
  }

  switch (entrypoint) {
    case 'onboarding':
    case 'popup':
    case 'request':
    case 'sidepanel':
      return entrypoint
    default:
      throw new Error(`Unknown entrypoint: ${entrypoint}`)
  }
}
