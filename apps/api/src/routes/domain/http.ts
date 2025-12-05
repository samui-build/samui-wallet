import { HttpApiBuilder } from '@effect/platform'
import { Effect } from 'effect'
import { Api } from '../../api.ts'

export const HttpDomainLive = HttpApiBuilder.group(Api, 'Domain', (handlers) =>
  Effect.gen(function* () {
    return handlers.handle('domainSearch', () =>
      Effect.gen(function* () {
        return yield* Effect.succeed('tobey.sol')
      }),
    )
  }),
)
