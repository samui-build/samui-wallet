import { Button } from '@workspace/ui/components/button'
import { LucideSave } from 'lucide-react'
import type { ComponentProps } from 'react'

export function OnboardingUiMnemonicSave({
  label,
  ...props
}: { label: string } & Omit<ComponentProps<typeof Button>, 'onClick'>) {
  return (
    <Button type="submit" {...props}>
      <LucideSave />
      {label}
    </Button>
  )
}
