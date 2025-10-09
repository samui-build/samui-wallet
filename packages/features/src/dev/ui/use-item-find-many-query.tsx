import { DbBrowserContext } from '../data-access/db-browser-provider.js'
import { useQuery } from '@tanstack/react-query'

export function useItemFindManyQuery({
  itemFindMany,
  table,
}: {
  itemFindMany: DbBrowserContext['itemFindMany']
  table: string
}) {
  return useQuery({
    queryKey: ['table', table],
    queryFn: () => itemFindMany({ table }),
  })
}
