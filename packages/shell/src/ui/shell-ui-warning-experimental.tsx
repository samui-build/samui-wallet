import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { AlertTriangle, LucideX } from 'lucide-react'

export function ShellUiWarningExperimental() {
  const [accepted, setAccepted] = useDbPreference('warningAcceptExperimental')
  return accepted !== 'true' ? (
    <Alert className="rounded-none border-1 border-yellow-500 bg-yellow-500/10 text-yellow-500">
      <AlertTriangle />
      <AlertTitle>This is experimental software.</AlertTitle>
      <AlertDescription>Use this wallet at your own risk. Do not use any real funds.</AlertDescription>
      <Button className="absolute top-2 right-2" onClick={() => setAccepted('true')} size="icon" variant="ghost">
        <LucideX />
      </Button>
    </Alert>
  ) : null
}
