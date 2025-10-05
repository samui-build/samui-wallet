import { useOnboarding } from '../data-access/onboarding-provider.js'
import { Button } from '@workspace/ui/components/button.js'
import { handleCopyText } from '../../core/handle-copy-text.js'
import { LucideCopy } from 'lucide-react'

export function OnboardingUiMnemonicCopy() {
  const { mnemonic } = useOnboarding()
  return (
    <Button variant="secondary" onClick={() => handleCopyText(mnemonic)}>
      <LucideCopy />
      Copy
    </Button>
  )
}
