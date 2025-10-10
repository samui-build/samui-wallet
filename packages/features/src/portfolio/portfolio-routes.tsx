import { useRoutes } from 'react-router'

import { CoreNotFound } from '../core/ui/core-not-found.js'
import { PortfolioFeatureIndex } from './portfolio-feature-index.js'

export default function PortfolioRoutes() {
  return useRoutes([
    { element: <PortfolioFeatureIndex />, index: true },
    { element: <CoreNotFound />, path: '*' },
  ])
}
