import { useSetting } from '@workspace/db-react/use-setting'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'

export function ShellUiDeveloperModeLink() {
  const [developerModeEnabled] = useSetting('developerModeEnabled')

  return developerModeEnabled === 'true' ? (
    <Button asChild size="icon" variant="outline">
      <Link to="/dev">
        <UiIcon icon="bug" />
      </Link>
    </Button>
  ) : null
}
