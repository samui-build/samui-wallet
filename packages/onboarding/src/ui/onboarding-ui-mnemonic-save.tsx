import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { ComponentProps } from 'react'

export function OnboardingUiMnemonicSave({
  label,
  ...props
}: { label: string } & Omit<ComponentProps<typeof Button>, 'onClick'>) {
  return (
    <Button type="submit" {...props}>
      <UiIcon icon="save" />
      {label}
    </Button>
  )
}
