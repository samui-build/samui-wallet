import { useMemo } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert.js'
import { AlertCircleIcon } from 'lucide-react'
import { Input } from '@workspace/ui/components/input.js'
import { Label } from '@workspace/ui/components/label.js'
import { useOnboarding } from '../data-access/onboarding-provider.js'

export function OnboardingUiMnemonicShow() {
  const { mnemonic } = useOnboarding()
  const expected = [12, 24]
  const words = useMemo(() => mnemonic.split(' '), [mnemonic])
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
        <OnboardingUiMnemonicShowWord key={index.toString()} index={index} word={word} />
      ))}
    </div>
  )
}

export function OnboardingUiMnemonicShowWord({ index, word }: { index: number; word: string }) {
  return (
    <div className="relative">
      <Label htmlFor={word} className="absolute -top-2 left-2 inline-block px-1 text-xs font-medium">
        <span>{index + 1}</span>
      </Label>
      <Input
        type="text"
        id={word}
        defaultValue={word}
        readOnly
        className="block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all duration-150"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  )
}
