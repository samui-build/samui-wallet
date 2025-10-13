import { handlers } from '@workspace/background/background'
import { registerDbService } from '@workspace/background/services/db'

export default defineBackground(() => {
  registerDbService()
  handlers()
})
