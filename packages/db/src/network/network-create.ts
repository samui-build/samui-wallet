import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'
import { randomId } from '../random-id.ts'
import type { NetworkCreateInput } from './network-create-input.ts'
import { networkCreateSchema } from './network-create-schema.ts'

export async function networkCreate(ctx: AppContext, input: NetworkCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = networkCreateSchema.parse(input)

  return ctx.db.transaction('rw', ctx.db.networks, async () => {
    return tryCatchOrThrow(
      ctx.db.networks.add({
        ...parsedInput,
        createdAt: now,
        id: randomId(),
        updatedAt: now,
      }),
      `Error creating network`,
    )
  })
}
