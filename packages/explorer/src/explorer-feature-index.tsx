import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { Link } from 'react-router'
import { ExplorerUiEmpty } from './ui/explorer-ui-empty.tsx'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export function ExplorerFeatureIndex() {
  return (
    <ExplorerUiPage>
      <ExplorerUiEmpty description="Placeholder for the Explorer Index page" title="Explorer Index">
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
      </ExplorerUiEmpty>
    </ExplorerUiPage>
  )
}
