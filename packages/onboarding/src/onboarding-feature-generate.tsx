import { useTranslation } from '@workspace/i18n'
import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { validateMnemonic } from '@workspace/keypair/validate-mnemonic'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { toastError } from '@workspace/ui/lib/toast-error'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useCreateNewWallet } from './data-access/use-create-new-wallet.tsx'
import { OnboardingUiMnemonicSave } from './ui/onboarding-ui-mnemonic-save.tsx'
import { OnboardingUiMnemonicSelectStrength } from './ui/onboarding-ui-mnemonic-select-strength.tsx'
import { OnboardingUiMnemonicShow } from './ui/onboarding-ui-mnemonic-show.tsx'

export function OnboardingFeatureGenerate({ redirectTo }: { redirectTo: string }) {
  const { t } = useTranslation('onboarding')
  const create = useCreateNewWallet()
  const navigate = useNavigate()
  const [strength, setStrength] = useState<MnemonicStrength>(128)
  const mnemonic = useMemo(() => generateMnemonic({ strength }), [strength])

  async function handleSubmit() {
    try {
      await create(mnemonic)
      await navigate(redirectTo)
    } catch (error) {
      toastError(`${error}`)
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await handleSubmit()
      }}
    >
      <UiCard
        description={t(($) => $.generateCardDescription)}
        footer={
          <div className="flex w-full justify-between">
            <UiTextCopyButton
              label={t(($) => $.generateToastCopy)}
              text={mnemonic}
              toast={t(($) => $.generateToastCopied)}
            />
            <OnboardingUiMnemonicSave
              disabled={!validateMnemonic({ mnemonic })}
              label={t(($) => $.generateButtonCreate)}
            />
          </div>
        }
        title={
          <div>
            <UiBackButton className="mr-2" />
            {t(($) => $.generateCardTitle)}
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
    </form>
  )
}
