import { useQuery } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbItems } from '@workspace/db/db-info'

export function useDbItems(name?: string) {
  return useQuery({
    enabled: !!name,
    queryFn: () => {
      if (!name) {
        return null
      }
      return dbItems(db, name)
    },
    queryKey: ['dbItems', name],
  })
}
