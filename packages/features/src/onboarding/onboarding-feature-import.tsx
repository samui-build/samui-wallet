import { Input } from '@workspace/ui/components/input.js'
import React, { useMemo, useState } from 'react'
import { Label } from '@workspace/ui/components/label.js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card.js'
import { Button } from '@workspace/ui/components/button.js'
import { UiBackButton } from './ui-back-button.js'

function InputGroup({
  index,
  value,
  onChange,
  onPaste,
}: {
  index: number
  value: string
  onChange: (index: number, word: string) => void
  onPaste: (e: DataTransfer, index: number) => void
}) {
  return (
    <div className="relative">
      <Label
        htmlFor={`word-${index}`}
        className="absolute -top-2 left-2 inline-block bg-white dark:bg-zinc-900 px-1 text-xs font-medium text-zinc-500 dark:text-zinc-400"
      >
        {index}
      </Label>
      <Input
        id={`word-${index}`}
        type="text"
        value={value}
        onChange={(event) => onChange(index - 1, event.target.value)}
        onPaste={(event) => {
          event.preventDefault()
          onPaste(event.clipboardData, index - 1)
        }}
        className="block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 dark:text-zinc-50 bg-transparent shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all duration-150"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  )
}

export function OnboardingFeatureImport() {
  const [wordCount, setWordCount] = useState(12)
  const [words, setWords] = useState(Array(24).fill(''))
  const [error, setError] = useState('')

  function handleWordChange(index: number, value: string) {
    // Only allow alphabetic characters and trim whitespace
    const newWords = [...words]
    newWords[index] = value.toLowerCase().replace(/[^a-z]/g, '')
    setWords(newWords)
  }

  function handlePaste(clipboardData: DataTransfer, startIndex: number) {
    const pasteData = clipboardData.getData('text').trim().toLowerCase()
    const pastedWords = pasteData.split(/\s+/).filter((word) => word.length > 0)

    if (pastedWords.length === 12 || pastedWords.length === 24) {
      setWordCount(pastedWords.length)
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

  function handleSubmit() {
    if (!isFormComplete) {
      setError(`Please enter all ${wordCount} words.`)
      return
    }
    setError('')
    // In a real app, you would validate the mnemonic here.
    console.log('Submitted Phrase:', words.slice(0, wordCount).join(' '))
    alert(`Wallet recovery initiated with ${wordCount} words. Check console for details.`)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <UiBackButton className="mr-2" />
            Enter Recovery Phrase
          </CardTitle>
          <CardDescription>
            Enter the {wordCount}-word phrase you were given when you created your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-2 mb-6 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
            <Button
              onClick={() => setWordCount(12)}
              className={` ${wordCount === 12 ? 'bg-white dark:bg-zinc-700 shadow' : 'bg-transparent text-zinc-500 dark:text-zinc-400'}`}
            >
              12 Words
            </Button>
            <Button
              onClick={() => setWordCount(24)}
              className={` ${wordCount === 24 ? 'bg-white dark:bg-zinc-700 shadow' : 'bg-transparent text-zinc-500 dark:text-zinc-400'}`}
            >
              24 Words
            </Button>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6`}>
            {Array.from({ length: wordCount }).map((_, index) => (
              <InputGroup
                key={index}
                index={index + 1}
                value={words[index]}
                onChange={handleWordChange}
                onPaste={handlePaste}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={!isFormComplete}>
            Import Wallet
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
