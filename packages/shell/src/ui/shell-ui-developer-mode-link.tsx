import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { Button } from '@workspace/ui/components/button'
import { LucideBug } from 'lucide-react'
import { Link } from 'react-router'

export function ShellUiDeveloperModeLink() {
  const [developerMode] = useDbSetting('developerModeEnabled')

  return developerMode === 'true' ? (
    <Button asChild size="icon" variant="outline">
      <Link to="/dev">
        <LucideBug />
      </Link>
    </Button>
  ) : null
}
