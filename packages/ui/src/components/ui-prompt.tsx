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
import type { ComponentProps, FormEvent, ReactNode } from 'react'
import { useEffect, useId, useState } from 'react'

interface UiPromptProps {
  action: (value: string) => void
  actionLabel: ReactNode
  children: ReactNode
  description?: ReactNode | undefined
  inputProps?: ComponentProps<typeof Input>
  label: ReactNode
  placeholder?: string
  title: ReactNode
  value: string
}

export function UiPrompt({
  action,
  actionLabel,
  children,
  description,
  inputProps,
  label,
  placeholder,
  title,
  value: inputValue,
}: UiPromptProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(inputValue)
  const inputId = useId()

  useEffect(() => {
    setValue(inputValue)
  }, [inputValue])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    action(value.trim())
    setIsOpen(false)
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
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
                {...inputProps}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{actionLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
