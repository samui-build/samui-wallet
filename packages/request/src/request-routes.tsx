import { useRoutes } from 'react-router'
import { RequestFeatureConnect } from './request-feature-connect.tsx'
import { RequestFeatureSignAndSendTransaction } from './request-feature-sign-and-send-transaction.tsx'
import { RequestFeatureSignIn } from './request-feature-sign-in.tsx'
import { RequestFeatureSignMessage } from './request-feature-sign-message.tsx'
import { RequestFeatureSignTransaction } from './request-feature-sign-transaction.tsx'
import { RequestUiLayout } from './ui/request-ui-layout.tsx'

export default function RequestRoutes() {
  return useRoutes([
    {
      children: [
        { element: <RequestFeatureConnect />, path: 'connect' },
        {
          element: <RequestFeatureSignAndSendTransaction />,
          path: 'sign-and-send-transaction',
        },
        { element: <RequestFeatureSignIn />, path: 'sign-in' },
        { element: <RequestFeatureSignMessage />, path: 'sign-message' },
        { element: <RequestFeatureSignTransaction />, path: 'sign-transaction' },
      ],
      element: <RequestUiLayout />,
    },
  ])
}
