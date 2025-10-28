import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'

import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { toastError } from '@workspace/ui/lib/toast-error'
import { useMemo, useState } from 'react'

import { useCreateNewAccount } from './data-access/use-create-new-account.js'
import { OnboardingUiMnemonicSave } from './ui/onboarding-ui-mnemonic-save.js'
import { OnboardingUiMnemonicSelectStrength } from './ui/onboarding-ui-mnemonic-select-strength.js'
import { OnboardingUiMnemonicShow } from './ui/onboarding-ui-mnemonic-show.js'

export function OnboardingFeatureGenerate() {
  const create = useCreateNewAccount()
  const [strength, setStrength] = useState<MnemonicStrength>(128)
  const mnemonic = useMemo(() => generateMnemonic({ strength }), [strength])

  async function handleSubmit() {
    try {
      await create(mnemonic)
    } catch (error) {
      toastError(`${error}`)
    }
  }

  return (
    <UiCard
      description="This seed phrase is the ONLY way to recover your wallet. Don't share it with anyone!"
      footer={
        <div className="flex w-full justify-between">
          <UiTextCopyButton text={mnemonic} toast="Mnemonic copied to clipboard" />
          <OnboardingUiMnemonicSave label="Create wallet" onClick={handleSubmit} />
        </div>
      }
      title={
        <div>
          <UiBackButton className="mr-2" />
          Generate Recovery Phrase
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <OnboardingUiMnemonicSelectStrength setStrength={setStrength} strength={strength} />
          </div>
        </div>
        <OnboardingUiMnemonicShow mnemonic={mnemonic} />
      </div>
    </UiCard>
  )
}
