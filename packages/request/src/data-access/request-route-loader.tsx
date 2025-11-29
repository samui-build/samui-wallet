import { getRequestService } from '@workspace/background/services/request'

export async function requestRouteLoader() {
  const result = await getRequestService().get()
  if (!result) {
    throw new Response('Not Found', { status: 404 })
  }

  return result.data
}
