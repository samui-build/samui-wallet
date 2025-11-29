import { useQuery, useQueryClient } from '@tanstack/react-query'
import { onMessage } from '@workspace/background/extension'
import { getRequestService } from '@workspace/background/services/request'
import { useEffect } from 'react'

import { Connect } from './connect.tsx'
import { SignIn } from './sign-in.tsx'
import { SignMessage } from './sign-message.tsx'

export function Request() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryFn: async () => await getRequestService().get(),
    queryKey: ['request'],
  })

  // TODO: How can we better handle this cache invalidation?
  useEffect(() => {
    const unsubscribe = onMessage('invalidateRequest', () => {
      queryClient.invalidateQueries({ queryKey: ['request'] })
    })

    return unsubscribe
  }, [queryClient])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return null
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
