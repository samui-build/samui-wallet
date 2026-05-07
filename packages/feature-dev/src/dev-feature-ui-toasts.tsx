import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastLoading } from '@workspace/ui/lib/toast-loading'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

const loadingToastDuration = 2000

function showLoadingToast() {
  const { dismiss } = toastLoading('Loading toast')
  window.setTimeout(dismiss, loadingToastDuration)
}

export function DevFeatureUiToasts() {
  return (
    <UiCard title="ui toasts">
      <ButtonGroup className="flex-wrap">
        <Button onClick={() => toastError('Error toast')} variant="outline">
          Error
        </Button>
        <Button onClick={showLoadingToast} variant="outline">
          Loading
        </Button>
        <Button
          onClick={() => {
            toastError('Error toast')
            showLoadingToast()
            toastSuccess('Success toast')
          }}
          variant="outline"
        >
          Stack
        </Button>
        <Button onClick={() => toastSuccess('Success toast')} variant="outline">
          Success
        </Button>
      </ButtonGroup>
    </UiCard>
  )
}
