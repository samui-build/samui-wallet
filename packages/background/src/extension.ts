import { defineExtensionMessaging } from '@webext-core/messaging'

import type { Schema } from './schema'

export const { onMessage, sendMessage } = defineExtensionMessaging<Schema>()
