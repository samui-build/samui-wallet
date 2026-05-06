import { cn } from '@workspace/ui/lib/utils'

export function OnboardingUiMnemonicWordReadonly({
  index,
  word,
  revealed,
}: {
  index: number
  word: string
  revealed: boolean
}) {
  return (
    <div className={cn('relative', { 'pointer-events-none select-none blur-sm': !revealed })}>
      <span className="absolute -top-2 left-2 inline-block bg-white px-1 font-medium text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
        {index + 1}
      </span>
      <div className="block w-full rounded-md border-0 bg-transparent px-3 py-2.5 text-zinc-900 shadow-sm ring-1 ring-zinc-300 ring-inset transition-all duration-150 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6 dark:text-zinc-50 dark:ring-zinc-700 dark:focus:ring-blue-500 dark:placeholder:text-zinc-500">
        {word}
      </div>
    </div>
  )
}
