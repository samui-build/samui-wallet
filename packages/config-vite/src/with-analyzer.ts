import { analyzer } from 'vite-bundle-analyzer'

export function withAnalyzer(enabled = !!process.env['ANALYZE']) {
  return analyzer({ enabled })
}
