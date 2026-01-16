import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import { parseStrict } from '../parse-strict.ts'
import type { NetworkUpdateInput } from './network-update-input.ts'
import { networkUpdateSchema } from './network-update-schema.ts'

export async function networkUpdate(db: Database, id: string, input: NetworkUpdateInput): Promise<number> {
  const parsedInput = parseStrict(networkUpdateSchema.parse(input))
  return db.transaction('rw', db.networks, async () => {
    const result = await Result.tryPromise(() =>
      db.networks.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error updating network with id ${id}`)
    }
    return result.value
  })
}
