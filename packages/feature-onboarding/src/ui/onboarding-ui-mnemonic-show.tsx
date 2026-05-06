import { useTranslation } from '@workspace/i18n'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { useMemo } from 'react'
import { OnboardingUiMnemonicWordReadonly } from './onboarding-ui-mnemonic-word-readonly.tsx'

export function OnboardingUiMnemonicShow({ mnemonic, revealed }: { mnemonic: string; revealed: boolean }) {
  const { t } = useTranslation('onboarding')
  const expected = [12, 24]
  const words = useMemo(() => mnemonic.trim().split(/\s+/), [mnemonic])
  if (!expected.includes(words.length)) {
    return (
      <Alert variant="destructive">
        <UiIcon icon="alert" />
        <AlertTitle>{t(($) => $.uiMnemonicUnexpectedLength)}</AlertTitle>
        <AlertDescription>
          Mnemonic has {words.length} words, expected {expected.join(' or ')}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3`}>
      {words.map((word, index) => (
        <OnboardingUiMnemonicWordReadonly index={index} key={`${index}-${word}`} revealed={revealed} word={word} />
      ))}
    </div>
  )
}
