import type { z } from 'zod'

import type { walletSchemaCreate } from '../schema/wallet-schema-create'

export type WalletInputCreate = z.infer<typeof walletSchemaCreate>
