import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useTranslation } from '@workspace/i18n'
import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import { validateMnemonic } from '@workspace/keypair/validate-mnemonic'
import { Form } from '@workspace/ui/components/form'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiTextPasteButton } from '@workspace/ui/components/ui-text-paste-button'
import { toastError } from '@workspace/ui/lib/toast-error'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { useCreateNewWallet } from './data-access/use-create-new-wallet.tsx'
import { OnboardingUiMnemonicWordInput } from './onboarding-ui-mnemonic-word-input.tsx'
import { OnboardingUiMnemonicSave } from './ui/onboarding-ui-mnemonic-save.tsx'
import { OnboardingUiMnemonicSelectStrength } from './ui/onboarding-ui-mnemonic-select-strength.tsx'

const onboardingImportSchema = z.object({
  strength: z.union([z.literal(128), z.literal(256)]),
  words: z.array(z.string()),
})

type OnboardingImportForm = z.infer<typeof onboardingImportSchema>

export function OnboardingFeatureImport({ redirectTo }: { redirectTo: string }) {
  const { t } = useTranslation('onboarding')
  const create = useCreateNewWallet()
  const navigate = useNavigate()

  const form = useForm<OnboardingImportForm>({
    defaultValues: {
      strength: 128,
      words: Array(24).fill(''),
    },
    resolver: standardSchemaResolver(onboardingImportSchema),
  })

  const { getValues, handleSubmit, reset, setValue, setError, watch } = form

  const strength = watch('strength')
  const words = watch('words')
  const wordCount = strength === 128 ? 12 : 24

  function handleWordChange(index: number, value: string) {
    // Only allow alphabetic characters and trim whitespace
    const currentWords = getValues('words')
    const newWords = [...currentWords]
    newWords[index] = value.toLowerCase().replace(/[^a-z]/g, '')
    setValue('words', newWords)
  }

  function handlePaste(pasteData: string, startIndex: number = 0) {
    const pastedWords = pasteData.split(/\s+/).filter((word) => word.length > 0)
    const mnemonicStrength = getMnemonicStrength(pastedWords.length)

    if (mnemonicStrength !== false) {
      setValue('strength', mnemonicStrength)
      const newWords = Array(24).fill('')

      pastedWords.forEach((word, i) => {
        if (i < 24) {
          newWords[i] = word.replace(/[^a-z]/g, '')
        }
      })
      setValue('words', newWords)
    } else {
      const currentWords = getValues('words')
      const newWords = [...currentWords]

      pastedWords.forEach((word, i) => {
        const targetIndex = startIndex + i
        if (targetIndex < currentWords.length) {
          newWords[targetIndex] = word.replace(/[^a-z]/g, '')
        }
      })
      setValue('words', newWords)
    }
  }

  const isFormComplete = useMemo(() => {
    return words.slice(0, wordCount).every((word) => word.trim().length > 1)
  }, [words, wordCount])

  async function submit() {
    if (!isFormComplete) {
      setError('words', { message: `Please enter all ${wordCount} words.` })
      return
    }

    try {
      const mnemonic = validateMnemonic({ mnemonic: words.slice(0, wordCount).join(' ') })
      await create(mnemonic)
      await navigate(redirectTo)
    } catch (error) {
      toastError(`${error}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
        <UiCard
          description={t(($) => $.importCardDescription)}
          footer={
            <div className="flex w-full justify-between">
              <UiTextPasteButton label={t(($) => $.importToastPaste)} onPaste={handlePaste} />
              <OnboardingUiMnemonicSave disabled={!isFormComplete} label={t(($) => $.importButtonSubmit)} />
            </div>
          }
          title={
            <div>
              <UiBackButton className="mr-2" />
              {t(($) => $.importCardTitle)}
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex justify-between">
              <div>
                <OnboardingUiMnemonicSelectStrength
                  setStrength={(newStrength: MnemonicStrength) => {
                    reset({
                      strength: newStrength,
                      words: Array(24).fill(''),
                    })
                  }}
                  strength={strength}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
              {Array.from({ length: wordCount }, (_, i) => i).map((index) => (
                <OnboardingUiMnemonicWordInput
                  index={index + 1}
                  key={index}
                  onChange={handleWordChange}
                  onPaste={(dataTransfer) => {
                    const text = dataTransfer.getData('text').trim().toLowerCase()
                    if (text.length) {
                      handlePaste(text)
                    }
                  }}
                  value={words[index] || ''}
                />
              ))}
            </div>

            {form.formState.errors.words ? (
              <p className="mt-4 text-center text-red-500 text-sm">{form.formState.errors.words.message}</p>
            ) : null}
          </div>
        </UiCard>
      </form>
    </Form>
  )
}

function getMnemonicStrength(len: number): false | MnemonicStrength {
  if (len === 12) {
    return 128
  }
  if (len === 24) {
    return 256
  }
  return false
}
