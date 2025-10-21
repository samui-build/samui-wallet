import { useDbReset } from '@workspace/db-react/use-db-reset'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import { Link } from 'react-router'

export function SettingsFeatureGeneralDangerDeleteDatabase() {
  const mutation = useDbReset()
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label>Delete the database</Label>
      <Button
        onClick={async () => {
          if (!window.confirm('Are you sure? This action can not be reversed.')) {
            return
          }
          if (!window.confirm('Any mnemonic stored in the database will be lost. Do you want to continue?')) {
            return
          }
          await mutation.mutateAsync()

          window.location.replace('/')
        }}
        variant="destructive"
      >
        Delete Database
      </Button>
    </div>
  )
}
export function SettingsFeatureGeneralDangerDevelopers() {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label>Developer section</Label>
      <Button asChild variant="destructive">
        <Link to="/dev">Take me there!</Link>
      </Button>
    </div>
  )
}
