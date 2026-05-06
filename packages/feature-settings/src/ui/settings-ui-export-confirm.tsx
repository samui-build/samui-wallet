import { useTranslation } from '@workspace/i18n'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Label } from '@workspace/ui/components/label'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { useId, useState } from 'react'

export function SettingsUiExportConfirm({ confirm, label }: { confirm: () => void; label: string }) {
  const { t } = useTranslation('settings')
  const [accept, setAccept] = useState(false)
  const acceptId = useId()

  return (
    <div className="space-y-2">
      <ExportAlert text={t(($) => $.exportWarning1)} />
      <ExportAlert text={t(($) => $.exportWarning2)} />
      <ExportAlert text={t(($) => $.exportWarning3)} />
      <div className="flex items-start gap-2 p-2">
        <Checkbox checked={accept} id={acceptId} onCheckedChange={() => setAccept((prev) => !prev)} />
        <Label htmlFor={acceptId}>{t(($) => $.exportWarningAccept)}</Label>
      </div>
      <Button className="w-full" disabled={!accept} onClick={confirm} size="lg" variant="destructive">
        {label}
      </Button>
    </div>
  )
}

function ExportAlert({ text }: { text: string }) {
  return (
    <Alert variant="destructive">
      <UiIcon icon="alert" />
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  )
}
