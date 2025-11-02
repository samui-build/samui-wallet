import { useQuery } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbInfo } from '@workspace/db/db-info'

export function useDbInfo() {
  return useQuery({
    queryFn: () => dbInfo(db),
    queryKey: ['dbInfo'],
  })
}
