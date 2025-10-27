import { Button } from '@workspace/ui/components/button'
import { LucideSave } from 'lucide-react'

export function OnboardingUiMnemonicSave({ label, onClick }: { label: string; onClick: () => Promise<void> }) {
  return (
    <Button onClick={onClick}>
      <LucideSave />
      {label}
    </Button>
  )
}
