import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const promptSchema = z.object({
  value: z.string().trim(),
})

type PromptForm = z.infer<typeof promptSchema>

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
  const inputId = useId()

  const form = useForm<PromptForm>({
    resolver: standardSchemaResolver(promptSchema),
    values: { value: inputValue },
  })
  const { control, handleSubmit, reset } = form

  useEffect(() => {
    reset({ value: isOpen ? inputValue : '' })
  }, [isOpen, inputValue, reset])

  function submit(input: PromptForm) {
    action(input.value)
    setIsOpen(false)
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={inputId}>{label}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        autoFocus
                        id={inputId}
                        {...field}
                        {...inputProps}
                        placeholder={placeholder}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
      </DialogContent>
    </Dialog>
  )
}
