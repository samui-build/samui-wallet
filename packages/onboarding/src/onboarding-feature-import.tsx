import { useTranslation } from '@workspace/i18n'
import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import { validateMnemonic } from '@workspace/keypair/validate-mnemonic'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiTextPasteButton } from '@workspace/ui/components/ui-text-paste-button'
import { toastError } from '@workspace/ui/lib/toast-error'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useCreateNewWallet } from './data-access/use-create-new-wallet.tsx'
import { OnboardingUiMnemonicWordInput } from './onboarding-ui-mnemonic-word-input.tsx'
import { OnboardingUiMnemonicSave } from './ui/onboarding-ui-mnemonic-save.tsx'
import { OnboardingUiMnemonicSelectStrength } from './ui/onboarding-ui-mnemonic-select-strength.tsx'

export function OnboardingFeatureImport({ redirectTo }: { redirectTo: string }) {
  const { t } = useTranslation('onboarding')
  const create = useCreateNewWallet()
  const navigate = useNavigate()
  const [strength, setStrength] = useState<MnemonicStrength>(128)

  const wordCount = strength === 128 ? 12 : 24
  const [words, setWords] = useState(Array(24).fill(''))
  const [error, setError] = useState('')

  function handleWordChange(index: number, value: string) {
    // Only allow alphabetic characters and trim whitespace
    const newWords = [...words]
    newWords[index] = value.toLowerCase().replace(/[^a-z]/g, '')
    setWords(newWords)
  }

  function handlePaste(pasteData: string, startIndex: number = 0) {
    const pastedWords = pasteData.split(/\s+/).filter((word) => word.length > 0)

    const len = getMnemonicStrength(pastedWords.length)
    if (len !== false) {
      setStrength(len)
      const newWords = Array(24).fill('')
      pastedWords.forEach((word, i) => {
        if (i < 24) {
          newWords[i] = word.replace(/[^a-z]/g, '')
        }
      })
      setWords(newWords)
    } else {
      const newWords = [...words]
      pastedWords.forEach((word, i) => {
        const targetIndex = startIndex + i
        if (targetIndex < words.length) {
          newWords[targetIndex] = word.replace(/[^a-z]/g, '')
        }
      })
      setWords(newWords)
    }
  }

  const isFormComplete = useMemo(() => {
    return words.slice(0, wordCount).every((word) => word.trim().length > 1)
  }, [words, wordCount])

  async function handleSubmit() {
    if (!isFormComplete) {
      setError(`Please enter all ${wordCount} words.`)
      return
    }
    setError('')
    try {
      const mnemonic = validateMnemonic({ mnemonic: words.slice(0, wordCount).join(' ') })
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
              <OnboardingUiMnemonicSelectStrength setStrength={setStrength} strength={strength} />
            </div>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4`}>
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
                value={words[index]}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
      </UiCard>
    </form>
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
