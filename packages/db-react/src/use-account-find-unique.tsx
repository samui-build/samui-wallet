import { useQuery } from '@tanstack/react-query'

import { optionsAccount } from './options-account.tsx'

export function useAccountFindUnique({ id }: { id: string }) {
  return useQuery(optionsAccount.findUnique(id))
}
