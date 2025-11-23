import { useReset } from '@workspace/db-react/use-reset'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Label } from '@workspace/ui/components/label'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router'

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
        <Button asChild variant="outline">
          <Link to="/settings/general">Cancel</Link>
        </Button>
        <UiConfirm
          action={async () => {
            if (!accept) {
              return
            }
            await mutation.mutateAsync()
            await navigate('/')
          }}
          actionLabel="Delete"
          actionVariant="destructive"
          description="This action can not be reversed."
          title="Are you sure you want to reset the application?"
        >
          <Button disabled={!accept} variant="destructive">
            Delete Database
          </Button>
        </UiConfirm>
      </div>
    </div>
  )
}
