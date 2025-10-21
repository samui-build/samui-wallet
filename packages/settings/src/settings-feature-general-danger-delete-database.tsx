import { useDbReset } from '@workspace/db-react/use-db-reset'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'

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
