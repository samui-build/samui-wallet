import { useRoutes } from 'react-router'
import { PortfolioFeatureIndex } from './portfolio-feature-index.js'
import { CoreNotFound } from '../core/ui/core-not-found.js'

export default function PortfolioRoutes() {
  return useRoutes([
    { index: true, element: <PortfolioFeatureIndex /> },
    { path: '*', element: <CoreNotFound /> },
  ])
}
