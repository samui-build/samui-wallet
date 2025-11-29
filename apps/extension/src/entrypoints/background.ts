import { handlers } from '@workspace/background/background'
import { entrypointListeners } from '@workspace/background/entrypoint'
import { services } from '@workspace/background/services'

export default defineBackground(() => {
  services()
  handlers()
  entrypointListeners()
})
