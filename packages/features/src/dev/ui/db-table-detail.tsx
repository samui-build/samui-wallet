import { useState } from 'react'
import { DbItemForm } from './db-item-form.js'
import { useQueryClient } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table.js'
import { DbTableActions } from './db-table-actions.js'
import { Button } from '@workspace/ui/components/button.js'
import { DbBrowserContext } from '../data-access/db-browser-provider.js'
import { useItemFindManyQuery } from './use-item-find-many-query.js'
import { useItemCreateMutation } from './use-item-create-mutation.js'

interface DbTableDetailProps extends DbBrowserContext {
  headers: string[]
  table: string
  item?: string
  selectItem: (item: string) => void
}

function formatCell(value: Date | string | number | boolean | null | undefined | unknown): string {
  if (value instanceof Date) return value.toLocaleString()
  if (typeof value === 'object' && value !== null) return JSON.stringify(value)
  return String(value ?? '')
}

export function DbTableDetail({ table, headers, selectItem, ...context }: DbTableDetailProps) {
  const queryClient = useQueryClient()
  const [isCreateOpen, setCreateOpen] = useState(false)
  const { data: tableData = [], isLoading, isError } = useItemFindManyQuery({ ...context, table })

  const createMutation = useItemCreateMutation({
    ...context,
    table,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['table', table] })
      setCreateOpen(false)
    },
  })

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
              {headers.length > 0 && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={headers.length + 1} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={headers.length + 1} className="h-24 text-center text-destructive">
                  Error fetching data.
                </TableCell>
              </TableRow>
            ) : tableData.length > 0 ? (
              tableData.map((row) => (
                <TableRow key={row.id} onClick={() => selectItem(row.id)} className="cursor-pointer">
                  {headers.map((header) => (
                    <TableCell key={header} className="max-w-[200px] truncate">
                      {
                        // @ts-expect-error dynamic stuff is dynamic
                        formatCell(row[header])
                      }
                    </TableCell>
                  ))}
                  <TableCell>
                    <DbTableActions table={table} id={row.id ?? ''} record={row} headers={headers} {...context} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length + 1} className="h-24 text-center">
                  No results in table {table}.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <DbItemForm
          isOpen={isCreateOpen}
          onOpenChange={setCreateOpen}
          title={`Create Record in ${table}`}
          headers={headers}
          onSubmit={(data) => createMutation.mutate(data)}
          isSaving={createMutation.isPending}
        >
          <Button disabled={headers.length === 0}>Create New</Button>
        </DbItemForm>
      </div>
    </div>
  )
}
