import { useQuery } from '@tanstack/react-query'
import { getRequestService } from '@workspace/background/services/request'

export function App() {
  const request = getRequestService()
  const { data, isLoading } = useQuery({
    queryFn: async () => await request.get(),
    queryKey: ['request'],
  })

  if (isLoading || !data) {
    return <div>Loading...</div>
  }

  switch (data.type) {
    case 'connect':
      return (
        <div>
          <div>Connect</div>
          <button onClick={async () => request.resolve({ accounts: [] })}>Approve</button>
          <button onClick={async () => request.reject()}>Reject</button>
        </div>
      )

    default:
      throw new Error('Unknown request type')
  }
}
