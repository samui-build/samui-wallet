import { defineCustomEventMessaging } from '@webext-core/messaging/page'

import type { Schema } from './schema.ts'

export const { onMessage, sendMessage } = defineCustomEventMessaging<Schema>({
  namespace: 'samui-wallet',
})
