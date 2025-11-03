import { useQuery } from '@tanstack/react-query'
import { getRequestService } from '@workspace/background/services/request'

import { Connect } from '../../components/connect.tsx'
import { SignIn } from '../../components/sign-in.tsx'
import { SignMessage } from '../../components/sign-message.tsx'

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

    case 'signAndSendTransaction':
      return <SignAndSendTransaction data={data.data} />

    case 'signIn':
      return <SignIn data={data.data} />

    case 'signMessage':
      return <SignMessage data={data.data} />

    case 'signTransaction':
      return <SignTransaction data={data.data} />

    default:
      throw new Error('Unknown request type')
  }
}
