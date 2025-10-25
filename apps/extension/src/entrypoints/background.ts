import { handlers } from '@workspace/background/background'
import { services } from '@workspace/background/services'

export default defineBackground(() => {
  services()
  handlers()
})
