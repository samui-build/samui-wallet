import { createAppContext } from '@workspace/context/create-app-context'

import { registerDbService } from './services/db.ts'
import { registerRequestService } from './services/request.ts'
import { registerSignService } from './services/sign.ts'
import { registerVaultRuntimeService } from './services/vault.ts'

export function services() {
  const ctx = createAppContext()

  registerVaultRuntimeService(ctx)
  registerDbService(ctx)
  registerRequestService()
  registerSignService(ctx)
}
