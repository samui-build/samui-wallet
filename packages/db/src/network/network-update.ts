import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import { parseStrict } from '../parse-strict.ts'
import type { NetworkUpdateInput } from './network-update-input.ts'
import { networkUpdateSchema } from './network-update-schema.ts'

export async function networkUpdate(db: Database, id: string, input: NetworkUpdateInput): Promise<number> {
  const parsedInput = networkUpdateSchema.parse(input)
  const parsedStrictInput = parseStrict(parsedInput)
  return db.transaction('rw', db.networks, async () => {
    const { data, error } = await tryCatch(
      db.networks.update(id, {
        ...parsedStrictInput,
        ...('color' in input && input.color === undefined ? { color: undefined } : {}),
        updatedAt: new Date(),
      }),
    )
    if (error) {
      console.log(error)
      throw new Error(`Error updating network with id ${id}`)
    }
    return data
  })
}
