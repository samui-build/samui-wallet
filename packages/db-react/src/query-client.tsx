import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'

export const queryClient = new QueryClient({
  defaultOptions: {
    dehydrate: {
      serializeData: superjson.serialize,
    },
    hydrate: {
      deserializeData: superjson.deserialize,
    },
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})
