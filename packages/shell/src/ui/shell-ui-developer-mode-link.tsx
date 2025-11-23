import { useSetting } from '@workspace/db-react/use-setting'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'

export function ShellUiDeveloperModeLink() {
  const [developerMode] = useSetting('developerModeEnabled')

  return developerMode === 'true' ? (
    <Button asChild size="icon" variant="outline">
      <Link to="/dev">
        <UiIcon icon="bug" />
      </Link>
    </Button>
  ) : null
}
