import React, { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Label } from '@workspace/ui/components/label.js'
import { Input } from '@workspace/ui/components/input.js'
import { Button } from '@workspace/ui/components/button.js'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog.js'
import { DbItemInput } from '../data-access/db-browser-provider.js'

export interface FormField {
  name: string
  type: 'text' | 'number' | 'email' // Extend as needed
}

interface DbItemForm {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  headers: string[]
  initialData?: Record<string, unknown>
  onSubmit: (input: DbItemInput) => void
  isSaving: boolean
  children?: ReactNode
}

export function DbItemForm({
  isOpen,
  onOpenChange,
  title,
  headers = [],
  initialData = {},
  onSubmit,
  isSaving,
  children,
}: DbItemForm) {
  const fields: FormField[] = useMemo(
    () => headers.filter((h) => !['id', 'createdAt', 'updatedAt'].includes(h)).map((h) => ({ name: h, type: 'text' })), // Type detection could be enhanced here
    [headers],
  )

  const [formData, setFormData] = useState<Record<string, unknown>>(initialData)

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData)
    }
  }, [isOpen, initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'number' ? Number(value) : value
    setFormData((prev) => ({ ...prev, [name]: finalValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) {
      return
    }
    onSubmit(formData)
  }

  const content = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Fields like `id` and timestamps are handled automatically.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          {fields.map((field) => {
            const value = formData && formData[field.name] ? formData[field.name] : ''
            return (
              <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  {field.name}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={(value as string) ?? ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            )
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )

  if (children) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {content}
    </Dialog>
  )
}
