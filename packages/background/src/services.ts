import { registerDbService } from './services/db'
import { registerRequestService } from './services/request'
import { registerSignService } from './services/sign'

export function services() {
  registerDbService()
  registerRequestService()
  registerSignService()
}
