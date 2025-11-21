import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { Link, useRoutes } from 'react-router'
import { DevFeatureErrorRoute } from './dev-feature-error-route.tsx'
import { DevFeatureErrorUnknownComponent } from './dev-feature-error-unknown-component.tsx'

export default function DevFeatureError() {
  return useRoutes([
    { element: <DevFeatureErrorOverview />, index: true },
    {
      element: <DevFeatureErrorRoute />,
      path: 'error-route',
    },
    {
      element: <DevFeatureErrorUnknownComponent />,
      path: 'unknown-component',
    },
  ])
}

export function DevFeatureErrorOverview() {
  return (
    <div className="space-y-6">
      <div>Visit the routes below to trigger an error.</div>
      <ButtonGroup>
        <Button asChild variant="outline">
          <Link to="./error-route">Route Error</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="./unknown-component">Unknown Component</Link>
        </Button>
      </ButtonGroup>
    </div>
  )
}
