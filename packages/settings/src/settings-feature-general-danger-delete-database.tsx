import { useReset } from '@workspace/db-react/use-reset'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Label } from '@workspace/ui/components/label'
import { useId, useState } from 'react'
import { useNavigate } from 'react-router'

export function SettingsFeatureGeneralDangerDeleteDatabase() {
  const mutation = useReset()
  const [accept, setAccept] = useState(false)
  const acceptId = useId()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Checkbox checked={accept} id={acceptId} onCheckedChange={() => setAccept((prev) => !prev)} />
        <div className="grid gap-2">
          <Label htmlFor={acceptId}>Accept deletion of the database.</Label>
          <p className="text-muted-foreground text-sm">
            By clicking this checkbox, you accept that all data will be lost.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          disabled={!accept}
          onClick={async () => {
            if (!window.confirm('Are you sure? This action can not be reversed.')) {
              return
            }
            await mutation.mutateAsync()
            await navigate('/')
          }}
          variant="destructive"
        >
          Delete Database
        </Button>
      </div>
    </div>
  )
}
