import type { Requests } from '@workspace/background/services/request'
import { RequestFeatureConnect } from '@/features/request/request-feature-connect.tsx'
import { RequestFeatureSignAndSendTransaction } from '@/features/request/request-feature-sign-and-send-transaction.tsx'
import { RequestFeatureSignIn } from '@/features/request/request-feature-sign-in.tsx'
import { RequestFeatureSignMessage } from '@/features/request/request-feature-sign-message.tsx'
import { RequestFeatureSignTransaction } from '@/features/request/request-feature-sign-transaction.tsx'

export function RequestRouter({ request }: { request: Requests }) {
  switch (request.type) {
    case 'connect':
      return <RequestFeatureConnect />

    case 'signAndSendTransaction':
      return <RequestFeatureSignAndSendTransaction data={request.data} />

    case 'signIn':
      return <RequestFeatureSignIn data={request.data} />

    case 'signMessage':
      return <RequestFeatureSignMessage data={request.data} />

    case 'signTransaction':
      return <RequestFeatureSignTransaction data={request.data} />

    default:
      throw new Error('Unknown request type')
  }
}
