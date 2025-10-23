import { useQuery } from '@tanstack/react-query'
import { getDbService } from '@workspace/background/services/db'

export function App() {
  const { data, isLoading } = useQuery({ queryFn: async () => await getDbService().clusters(), queryKey: ['clusters'] })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <div>{JSON.stringify(data)}</div>
}
