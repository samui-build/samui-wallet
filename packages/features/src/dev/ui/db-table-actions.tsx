'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { MoreHorizontal } from 'lucide-react'

import { DbItemForm } from './db-item-form.js'
import { DbBrowserContext, DbItem } from '../data-access/db-browser-provider.js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu.js'
import { Button } from '@workspace/ui/components/button.js'
import { useItemDeleteMutation } from './use-item-delete-mutation.js'
import { useItemUpdateMutation } from './use-item-update-mutation.js'

interface DbTableActionsProps extends DbBrowserContext {
  headers: string[]
  record: DbItem
  table: string
  id: string
}

export function DbTableActions({ table, record, id, headers, itemDelete, itemUpdate }: DbTableActionsProps) {
  const queryClient = useQueryClient()
  const [isUpdateOpen, setUpdateOpen] = useState(false)

  const deleteMutation = useItemDeleteMutation({
    itemDelete,
    id,
    table,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['table', table] })
    },
  })

  const updateMutation = useItemUpdateMutation({
    itemUpdate,
    id,
    table,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['table', table] })
      setUpdateOpen(false)
    },
  })

  return (
    <div className="flex justify-end items-center">
      <DbItemForm
        isOpen={isUpdateOpen}
        onOpenChange={setUpdateOpen}
        title={`Update Record in ${table}`}
        headers={headers}
        initialData={record as unknown as Record<string, unknown>}
        onSubmit={(data) => updateMutation.mutate(data)}
        isSaving={updateMutation.isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setUpdateOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
