import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'

import { getRequestService } from '../services/request.ts'

export async function connect(input?: StandardConnectInput): Promise<StandardConnectOutput> {
  return await getRequestService().create('connect', input)
}
