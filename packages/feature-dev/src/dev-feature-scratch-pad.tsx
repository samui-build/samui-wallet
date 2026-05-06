import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export default function DevFeatureScratchPad() {
  return (
    <UiCard
      action={
        <Button
          onClick={() => {
            toastSuccess('Success')
          }}
          variant="outline"
        >
          Click
        </Button>
      }
      description="Your place to quickly test some UI components"
      title="Scratch Pad"
    >
      <div className="space-y-6">Start here</div>
    </UiCard>
  )
}
