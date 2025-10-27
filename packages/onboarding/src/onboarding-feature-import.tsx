import type { MnemonicStrength } from '@workspace/keypair/generate-mnemonic'

import { validateMnemonic } from '@workspace/keypair/validate-mnemonic'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiTextPasteButton } from '@workspace/ui/components/ui-text-paste-button'
import { toastError } from '@workspace/ui/lib/toast-error'
import { useMemo, useState } from 'react'

import { useCreateNewAccount } from './data-access/use-create-new-account.js'
import { OnboardingUiMnemonicWordInput } from './onboarding-ui-mnemonic-word-input.js'
import { OnboardingUiMnemonicSave } from './ui/onboarding-ui-mnemonic-save.js'
import { OnboardingUiMnemonicSelectStrength } from './ui/onboarding-ui-mnemonic-select-strength.js'

export function OnboardingFeatureImport() {
  const create = useCreateNewAccount()
  const [strength, setStrength] = useState<MnemonicStrength>(128)

  const [wordCount, setWordCount] = useState(12)
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
      setWordCount(pastedWords.length)
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
    } catch (error) {
      toastError(`${error}`)
    }
  }

  return (
    <div className="space-y-2">
      <UiCard
        description="Enter the seed phrase you stored when you created your wallet."
        footer={
          <div className="flex w-full justify-between">
            <UiTextPasteButton onPaste={handlePaste} />
            <OnboardingUiMnemonicSave label="Import wallet" onClick={handleSubmit} />
          </div>
        }
        title={
          <div>
            <UiBackButton className="mr-2" />
            Import Recovery Phrase
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
            {Array.from({ length: wordCount }).map((_, index) => (
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
    </div>
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
