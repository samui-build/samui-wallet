import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import type { FormEvent, ReactNode } from 'react'
import { useId, useState } from 'react'

interface UiPromptProps {
  title: ReactNode
  description: ReactNode
  label: ReactNode
  placeholder?: string
  actionLabel: ReactNode
  action: (value: string) => void
  children: ReactNode
}

export function UiPrompt({ title, description, label, placeholder, actionLabel, action, children }: UiPromptProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputId = useId()

  function handleOpenChange(shouldBeOpen: boolean) {
    setIsOpen(shouldBeOpen)
    if (!shouldBeOpen) {
      setValue('')
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (value.trim()) {
      action(value.trim())
      handleOpenChange(false)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <Label htmlFor={inputId}>{label}</Label>
              <Input
                autoFocus
                id={inputId}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                value={value}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button disabled={!value.trim()} type="submit">
              {actionLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
