import { registerDbService } from './services/db'
import { registerRequestService } from './services/request'

export function services() {
  registerDbService()
  registerRequestService()
}
