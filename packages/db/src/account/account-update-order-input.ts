import type { z } from 'zod'

import type { accountUpdateOrderSchema } from './account-update-order-schema.ts'

export type AccountUpdateOrderInput = z.infer<typeof accountUpdateOrderSchema>
