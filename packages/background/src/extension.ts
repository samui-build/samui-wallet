import { defineExtensionMessaging } from '@webext-core/messaging'

import type { Schema } from './schema.ts'

export const { onMessage, sendMessage } = defineExtensionMessaging<Schema>()
