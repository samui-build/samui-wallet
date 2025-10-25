import { useMutation } from '@tanstack/react-query'

import { getApiUrl } from './get-api-url'

export function useSdkHealthz(endpoint: null | string) {
  return useMutation({
    mutationFn: async () => {
      const url = getApiUrl(endpoint, '/healthz')
      if (!url) {
        return Promise.resolve(null)
      }
      return fetch(url)
        .then((res) => res.json())
        .catch((err) => {
          console.log(`Error fetching uptime`, err)
        })
    },
  })
}
