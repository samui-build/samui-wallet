import { useQuery } from '@tanstack/react-query'
import { getRequestService } from '@workspace/background/services/request'
import { RequestRouter } from '@/features/request/request-router.tsx'
import { ExtensionNoWallet } from '@/features/shell/extension-no-wallet.tsx'
import { useExtensionActiveWallet } from '@/features/shell/use-extension-active-wallet.tsx'

export function RequestFeature() {
  const { data: active } = useExtensionActiveWallet()
  const { data, isLoading } = useQuery({
    queryFn: async () => await getRequestService().get(),
    queryKey: ['request'],
  })

  if (isLoading || !data) {
    return <div>Loading...</div>
  }

  return active ? <RequestRouter request={data} /> : <ExtensionNoWallet />
}
