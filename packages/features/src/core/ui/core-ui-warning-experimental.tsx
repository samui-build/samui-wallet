import { usePreference } from '@workspace/settings/settings-feature-general'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert.js'
import { Button } from '@workspace/ui/components/button.js'
import { AlertTriangle, LucideX } from 'lucide-react'

export function CoreUiWarningExperimental() {
  const { update, value } = usePreference('warningAcceptExperimental')
  return value !== 'true' ? (
    <Alert className="rounded-none border-1 border-yellow-500 bg-yellow-500/10 text-yellow-500">
      <AlertTriangle />
      <AlertTitle>This is experimental software.</AlertTitle>
      <AlertDescription>Use this wallet at your own risk. Do not use any real funds.</AlertDescription>
      <Button className="absolute top-2 right-2" onClick={() => update('true')} size="icon" variant="ghost">
        <LucideX />
      </Button>
    </Alert>
  ) : null
}
