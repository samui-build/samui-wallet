import { useTranslation } from '@workspace/i18n'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { useEffect, useState } from 'react'
import { useShellCommandGroups } from './use-shell-command-groups.tsx'

export function ShellUiCommandMenu() {
  const { t } = useTranslation('shell')
  const [open, setOpen] = useState(false)
  const groups = useShellCommandGroups()

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandInput placeholder={t(($) => $.commandInputPlaceholder)} />
      <CommandList>
        <CommandEmpty>{t(($) => $.commandEmpty)}</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup heading={group.label} key={group.label}>
            {group.commands.map((command) => (
              <CommandItem
                disabled={command.disabled ?? false}
                key={command.label}
                onSelect={async () => {
                  await command.handler()
                  setOpen(false)
                }}
              >
                {command.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
