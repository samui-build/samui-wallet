import type { z } from 'zod'

import type { walletSchemaUpdate } from '../schema/wallet-schema-update'

export type WalletInputUpdate = z.infer<typeof walletSchemaUpdate>
