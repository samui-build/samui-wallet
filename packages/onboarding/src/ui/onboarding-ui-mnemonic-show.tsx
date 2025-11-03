import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { AlertCircleIcon } from 'lucide-react'
import { useMemo } from 'react'

import { OnboardingUiMnemonicWordReadonly } from './onboarding-ui-mnemonic-word-readonly.tsx'

export function OnboardingUiMnemonicShow({ mnemonic }: { mnemonic: string }) {
  const expected = [12, 24]
  const words = useMemo(() => mnemonic.trim().split(/\s+/), [mnemonic])
  if (!expected.includes(words.length)) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Unexpected mnemonic length</AlertTitle>
        <AlertDescription>
          Mnemonic has {words.length} words, expected {expected.join(' or ')}
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4`}>
      {words.map((word, index) => (
        <OnboardingUiMnemonicWordReadonly index={index} key={`${word}-${index}`} word={word} />
      ))}
    </div>
  )
}
