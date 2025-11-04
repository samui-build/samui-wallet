import { registerDbService } from './services/db.ts'
import { registerRequestService } from './services/request.ts'
import { registerSignService } from './services/sign.ts'

export function services() {
  registerDbService()
  registerRequestService()
  registerSignService()
}
