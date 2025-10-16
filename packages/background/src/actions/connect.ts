import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'

import { getRequestService } from '../services/request'

export async function connect(input?: StandardConnectInput): Promise<StandardConnectOutput> {
  console.log('Connect', input)

  return await getRequestService().create('connect', input)
}
