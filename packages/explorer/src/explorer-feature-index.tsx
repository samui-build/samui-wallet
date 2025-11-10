import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { LucideGlobe } from 'lucide-react'
import { Link } from 'react-router'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export function ExplorerFeatureIndex() {
  return (
    <ExplorerUiPage>
      <UiEmpty description="Placeholder for the Explorer Index page" icon={LucideGlobe} title="Explorer Index">
        <ButtonGroup orientation="vertical">
          <Button asChild variant="outline">
            <Link to="account/So11111111111111111111111111111111111111112">Account Page</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="tx/2RHM8HGK1NaHrWPnfLMDeBsANJAUh1NWefpYctp4v9ZCgLWVjczA8bsjubm4hDEdrdB5XQLKfkHYUoghZftfo1mZ">
              Tx Page
            </Link>
          </Button>
        </ButtonGroup>
      </UiEmpty>
    </ExplorerUiPage>
  )
}
