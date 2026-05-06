import { onMessage } from '@workspace/background/extension'
import type { Request } from '@workspace/background/services/request'
import { useEffect, useState } from 'react'
import { RequestUiConnect } from './ui/request-ui-connect.tsx'
import { RequestUiSignAndSendTransaction } from './ui/request-ui-sign-and-send-transaction.tsx'
import { RequestUiSignIn } from './ui/request-ui-sign-in.tsx'
import { RequestUiSignMessage } from './ui/request-ui-sign-message.tsx'
import { RequestUiSignTransaction } from './ui/request-ui-sign-transaction.tsx'

// TODO: Use a real dialog component with proper styling and accessibility
export function RequestFeatureDialog() {
  const [request, setRequest] = useState<Request | null>(null)

  useEffect(() => {
    const createUnsubscribe = onMessage('onRequestCreate', (request) => {
      setRequest(request.data)
    })

    const resetUnsubscribe = onMessage('onRequestReset', () => {
      setRequest(null)
    })

    return () => {
      createUnsubscribe()
      resetUnsubscribe()
    }
  }, [])

  if (!request) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="mx-4 w-full max-w-md rounded-lg bg-gray-900 p-6">
        {(() => {
          switch (request.type) {
            case 'connect':
              return <RequestUiConnect />

            case 'signAndSendTransaction':
              return <RequestUiSignAndSendTransaction data={request.data} />

            case 'signIn':
              return <RequestUiSignIn data={request.data} />

            case 'signMessage':
              return <RequestUiSignMessage data={request.data} />

            case 'signTransaction':
              return <RequestUiSignTransaction data={request.data} />

            default:
              throw new Error('Unknown request type')
          }
        })()}
      </div>
    </div>
  )
}
