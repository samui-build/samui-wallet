import { useQuery } from '@tanstack/react-query'
import { getDbService } from '@workspace/background/services/db'

export function useExtensionActiveWallet() {
  return useQuery({
    queryFn: async () => await getDbService().account.active(),
    queryKey: ['account', 'active'],
  })
}
