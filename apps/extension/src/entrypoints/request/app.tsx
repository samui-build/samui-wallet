import { useQuery } from '@tanstack/react-query'
import { getRequestService } from '@workspace/background/services/request'

import { SignMessage } from '@/components/sign-message'

import { Connect } from '../../components/connect'

export function App() {
  const { data, isLoading } = useQuery({
    queryFn: async () => await getRequestService().get(),
    queryKey: ['request'],
  })

  if (isLoading || !data) {
    return <div>Loading...</div>
  }

  switch (data.type) {
    case 'connect':
      return <Connect />

    case 'signMessage':
      return <SignMessage data={data.data} />

    default:
      throw new Error('Unknown request type')
  }
}
