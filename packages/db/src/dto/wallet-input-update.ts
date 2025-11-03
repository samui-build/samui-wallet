import type { z } from 'zod'

import type { walletSchemaUpdate } from '../schema/wallet-schema-update.ts'

export type WalletInputUpdate = z.infer<typeof walletSchemaUpdate>
