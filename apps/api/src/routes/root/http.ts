import { HttpApiBuilder } from '@effect/platform'
import { Effect } from 'effect'
import { Api } from '../../api.ts'

export const HttpRootLive = HttpApiBuilder.group(Api, 'Root', (handlers) =>
  Effect.gen(function* () {
    return handlers.handle('health', () =>
      Effect.gen(function* () {
        return yield* Effect.succeed('OK')
      }),
    )
  }),
)
