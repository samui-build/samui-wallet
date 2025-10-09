import { DbBrowserContext } from '../data-access/db-browser-provider.js'
import { useMutation } from '@tanstack/react-query'

export function useItemDeleteMutation({
  id,
  itemDelete,
  table,
  onSuccess,
}: {
  itemDelete: DbBrowserContext['itemDelete']
  onSuccess: () => void
  table: string
  id: string
}) {
  return useMutation({
    mutationFn: () => itemDelete({ id, table }),
    onSuccess,
  })
}
