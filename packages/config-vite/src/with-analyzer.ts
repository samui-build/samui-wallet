import { analyzer } from 'vite-bundle-analyzer'

export function withAnalyzer(enabled = !!process.env['ANALYZE']): ReturnType<typeof analyzer> {
  return analyzer({ enabled })
}
