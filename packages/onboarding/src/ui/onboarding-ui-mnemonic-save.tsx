import type { ComponentProps } from 'react'

import { Button } from '@workspace/ui/components/button'
import { LucideSave } from 'lucide-react'

export function OnboardingUiMnemonicSave({
  label,
  onClick,
  ...props
}: { label: string; onClick: () => Promise<void> } & Omit<ComponentProps<typeof Button>, 'onClick'>) {
  return (
    <Button onClick={onClick} type="submit" {...props}>
      <LucideSave />
      {label}
    </Button>
  )
}
