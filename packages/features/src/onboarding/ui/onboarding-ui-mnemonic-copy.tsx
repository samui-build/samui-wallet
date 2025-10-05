import { Button } from '@workspace/ui/components/button.js'
import { LucideCopy } from 'lucide-react'

import { handleCopyText } from '../../core/handle-copy-text.js'
import { useOnboarding } from '../data-access/onboarding-provider.js'

export function OnboardingUiMnemonicCopy() {
  const { mnemonic } = useOnboarding()
  return (
    <Button onClick={() => handleCopyText(mnemonic)} variant="secondary">
      <LucideCopy />
      Copy
    </Button>
  )
}
