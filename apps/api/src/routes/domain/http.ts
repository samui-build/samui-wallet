import { HttpApiBuilder } from '@effect/platform'
import { Effect, Layer } from 'effect'
import { Api } from '../../api.ts'
import { SnsService } from '../../services/sns/service.ts'

export const HttpDomainLive = HttpApiBuilder.group(Api, 'Domain', (handlers) =>
  Effect.gen(function* () {
    const snsApi = yield* SnsService

    return handlers.handle('domainSearch', ({ path }) =>
      Effect.gen(function* () {
        return yield* snsApi.search(path.domain)
      }),
    )
  }),
).pipe(Layer.provide([SnsService.Default]))
