import { DbBrowserContext } from '../data-access/db-browser-provider.js'
import { useMutation } from '@tanstack/react-query'
import { DbItemCreateInput } from '../data-access/db-item-create.js'

export function useItemCreateMutation({
  itemCreate,
  onSuccess,
  table,
}: {
  itemCreate: DbBrowserContext['itemCreate']
  onSuccess: () => void
  table: string
}) {
  return useMutation({
    mutationFn: (input: DbItemCreateInput) => itemCreate({ input, table }),
    onSuccess,
  })
}
