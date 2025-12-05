import { HttpApiBuilder } from '@effect/platform'
import { Effect, Encoding, Layer } from 'effect'
import { Api } from '../../api.ts'
import { SnsInvalidDomainName, SnsService } from '../../services/sns/service.ts'

export const HttpDomainLive = HttpApiBuilder.group(Api, 'Domain', (handlers) =>
  Effect.gen(function* () {
    const snsApi = yield* SnsService

    return handlers.handle('domainSearch', ({ path }) =>
      Effect.gen(function* () {
        const domain = yield* Encoding.encodeUriComponent(path.domain)
        return yield* snsApi.search(domain)
      }).pipe(
        Effect.catchTags({
          EncodeException: () => Effect.fail(new SnsInvalidDomainName({ domain: path.domain })),
        }),
      ),
    )
  }),
).pipe(Layer.provide([SnsService.Default]))
