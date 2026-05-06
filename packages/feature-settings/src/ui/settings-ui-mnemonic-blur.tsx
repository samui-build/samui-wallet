import { cn } from '@workspace/ui/lib/utils'

function SettingsUiMnemonicBlur({ value, revealed }: { value: string; revealed: boolean }) {
  return (
    <div
      className={cn(
        'field-sizing-content flex min-h-16 w-full break-all rounded-md border border-input bg-transparent px-3 py-2 text-left text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        { 'pointer-events-none select-none blur-sm': !revealed },
      )}
    >
      {value}
    </div>
  )
}

export { SettingsUiMnemonicBlur }
