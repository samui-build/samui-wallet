import { useAccountActive } from '@workspace/db-react/use-account-active'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useEffect, useState } from 'react'

// TODO: Split commands into separate components/files as they grow
export function ShellUiCommandMenu() {
  const [open, setOpen] = useState(false)
  const { publicKey } = useAccountActive()

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
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={async () => {
              try {
                await handleCopyText(publicKey)
                toastSuccess('Copied Public Key')
              } catch (error) {
                toastError(error instanceof Error ? error.message : 'Failed to copy public key')
              } finally {
                setOpen(false)
              }
            }}
          >
            Copy public key
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
