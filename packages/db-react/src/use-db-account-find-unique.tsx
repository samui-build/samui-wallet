import { useQuery } from '@tanstack/react-query'

import { dbAccountOptions } from './db-account-options'

export function useDbAccountFindUnique({ id }: { id: string }) {
  return useQuery(dbAccountOptions.findUnique(id))
}
