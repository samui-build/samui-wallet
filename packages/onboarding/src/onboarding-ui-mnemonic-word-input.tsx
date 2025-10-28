import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'

export function OnboardingUiMnemonicWordInput({
  index,
  onChange,
  onPaste,
  value,
}: {
  index: number
  onChange: (index: number, word: string) => void
  onPaste: (e: DataTransfer, index: number) => void
  value: string
}) {
  return (
    <div className="relative">
      <Label
        className="absolute -top-2 left-2 inline-block bg-white dark:bg-zinc-900 px-1 text-xs font-medium text-zinc-500 dark:text-zinc-400"
        htmlFor={`word-${index}`}
      >
        {index}
      </Label>
      <Input
        autoComplete="off"
        autoCorrect="off"
        className="block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 dark:text-zinc-50 bg-transparent shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all duration-150"
        id={`word-${index}`}
        onChange={(event) => onChange(index - 1, event.target.value)}
        onPaste={(event) => {
          event.preventDefault()
          onPaste(event.clipboardData, index - 1)
        }}
        spellCheck="false"
        type="text"
        value={value}
      />
    </div>
  )
}
