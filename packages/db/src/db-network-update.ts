import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { NetworkInputUpdate } from './dto/network-input-update.ts'

import { parseStrict } from './parse-strict.ts'
import { networkSchemaUpdate } from './schema/network-schema-update.ts'

export async function dbNetworkUpdate(db: Database, id: string, input: NetworkInputUpdate): Promise<number> {
  const parsedInput = parseStrict(networkSchemaUpdate.parse(input))
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error getting network with id ${id}`)
    },
    try: () =>
      db.networks.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
  })

  const data = await Effect.runPromise(result)
  return data
}
