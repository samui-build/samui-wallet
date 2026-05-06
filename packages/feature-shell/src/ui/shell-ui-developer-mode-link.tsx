import { isEnabled } from '@workspace/flags'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'

export function ShellUiDeveloperModeLink() {
  return isEnabled('developerMode') ? (
    <Button asChild size="icon" variant="outline">
      <Link to="/dev">
        <UiIcon icon="bug" />
      </Link>
    </Button>
  ) : null
}
