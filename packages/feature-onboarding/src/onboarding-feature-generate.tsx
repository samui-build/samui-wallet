import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useTranslation } from '@workspace/i18n'
import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { validateMnemonic } from '@workspace/keypair/validate-mnemonic'
import { Button } from '@workspace/ui/components/button'
import { Form } from '@workspace/ui/components/form'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { toastError } from '@workspace/ui/lib/toast-error'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { useCreateNewWallet } from './data-access/use-create-new-wallet.tsx'
import { OnboardingUiMnemonicSave } from './ui/onboarding-ui-mnemonic-save.tsx'
import { OnboardingUiMnemonicSelectStrength } from './ui/onboarding-ui-mnemonic-select-strength.tsx'
import { OnboardingUiMnemonicShow } from './ui/onboarding-ui-mnemonic-show.tsx'

const onboardingGenerateSchema = z.object({
  mnemonic: z.string(),
  strength: z.union([z.literal(128), z.literal(256)]),
})

type OnboardingGenerateForm = z.infer<typeof onboardingGenerateSchema>

export function OnboardingFeatureGenerate({ redirectTo }: { redirectTo: string }) {
  const { t } = useTranslation('onboarding')
  const create = useCreateNewWallet()
  const navigate = useNavigate()
  const [revealed, setRevealed] = useState<boolean>(false)

  const form = useForm<OnboardingGenerateForm>({
    defaultValues: {
      mnemonic: generateMnemonic({ strength: 128 }),
      strength: 128,
    },
    resolver: standardSchemaResolver(onboardingGenerateSchema),
  })
  const { handleSubmit, setValue, watch } = form

  const strength = watch('strength')
  const mnemonic = watch('mnemonic')

  async function submit(input: OnboardingGenerateForm) {
    try {
      await create(input.mnemonic)
      await navigate(redirectTo)
    } catch (error) {
      toastError(`${error}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
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
                <OnboardingUiMnemonicSelectStrength
                  setStrength={(newStrength: MnemonicStrength) => {
                    setValue('strength', newStrength)
                    setValue('mnemonic', generateMnemonic({ strength: newStrength }))
                  }}
                  strength={strength}
                />
              </div>
              <Button onClick={() => setRevealed((value) => !value)} type="button" variant="secondary">
                <UiIcon icon="watch" />
                {revealed ? t(($) => $.generateMnemonicHide) : t(($) => $.generateMnemonicShow)}
              </Button>
            </div>
            <OnboardingUiMnemonicShow mnemonic={mnemonic} revealed={revealed} />
          </div>
        </UiCard>
      </form>
    </Form>
  )
}
