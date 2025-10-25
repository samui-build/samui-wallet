import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useSdkHealthz } from '@workspace/sdk-react/use-sdk-healthz'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'

export default function DevFeatureSolana() {
  return (
    <div className="space-y-6">
      <DevSdkUptime />
    </div>
  )
}

function DevSdkUptime() {
  const [apiEndpoint] = useDbPreference('apiEndpoint')
  const mutation = useSdkHealthz(apiEndpoint)

  async function submit() {
    await mutation.mutateAsync()
  }

  return (
    <UiCard title="useSdkHealthz">
      <div className="space-y-2">
        <Button onClick={submit}>Submit</Button>
      </div>
      <pre>
        {JSON.stringify(
          {
            //
            data: mutation.data,
            error: mutation.error?.message,
            isError: mutation.isError,
            isPending: mutation.isPending,
          },
          null,
          2,
        )}
      </pre>
    </UiCard>
  )
}
