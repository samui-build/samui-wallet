import { DbBrowserContext, DbItemUpdateInput } from '../data-access/db-browser-provider.js'
import { useMutation } from '@tanstack/react-query'

export function useItemUpdateMutation({
  id,
  itemUpdate,
  table,
  onSuccess,
}: {
  itemUpdate: DbBrowserContext['itemUpdate']
  onSuccess: () => void
  table: string
  id: string
}) {
  return useMutation({
    mutationFn: (input: DbItemUpdateInput) => itemUpdate({ id, table, input }),
    onSuccess,
  })
}
