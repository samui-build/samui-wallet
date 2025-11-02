import type { z } from 'zod'

import type { walletSchemaUpdate } from '../schema/wallet-schema-update.js'

export type WalletInputUpdate = z.infer<typeof walletSchemaUpdate>
