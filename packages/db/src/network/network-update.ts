import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'
import { parseStrict } from '../parse-strict.ts'
import type { NetworkUpdateInput } from './network-update-input.ts'
import { networkUpdateSchema } from './network-update-schema.ts'

export async function networkUpdate(ctx: AppContext, id: string, input: NetworkUpdateInput): Promise<number> {
  const parsedInput = networkUpdateSchema.parse(input)
  const parsedStrictInput = parseStrict(parsedInput)
  return ctx.db.transaction('rw', ctx.db.networks, async () => {
    return tryCatchOrThrow(
      ctx.db.networks.update(id, {
        ...parsedStrictInput,
        ...('color' in input && input.color === undefined ? { color: undefined } : {}),
        updatedAt: new Date(),
      }),
      `Error updating network with id ${id}`,
    )
  })
}
