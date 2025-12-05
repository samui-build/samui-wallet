import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from '@effect/platform'
import { Effect, flow, Schema } from 'effect'

export class SnsInvalidDomainName extends Schema.TaggedError<SnsInvalidDomainName>()('SnsInvalidDomainName', {
  domain: Schema.String,
}) {}

export class SnsResolveResponse extends Schema.Class<SnsResolveResponse>('SnsResolveResponse')({
  result: Schema.String,
  s: Schema.Literal('ok', 'error'),
}) {}

export class SnsDomainNotFound extends Schema.TaggedError<SnsDomainNotFound>()('SnsDomainNotFound', {
  domain: Schema.String,
}) {}

export class SnsSearchResult extends Schema.Class<SnsSearchResult>('SnsSearchResult')({
  address: Schema.String,
}) {}

export class SnsServiceUnavailable extends Schema.TaggedError<SnsServiceUnavailable>()('SnsServiceUnavailable', {}) {}

export class SnsService extends Effect.Service<SnsService>()('Sns', {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function* () {
    const baseClient = yield* HttpClient.HttpClient
    const snsClient = baseClient.pipe(
      HttpClient.mapRequest(
        flow(HttpClientRequest.acceptJson, HttpClientRequest.prependUrl('https://sns-sdk-proxy.bonfida.workers.dev')),
      ),
    )

    return {
      search: (domain: string) =>
        Effect.gen(function* () {
          if (!domain.endsWith('.sol')) {
            throw new SnsInvalidDomainName({ domain })
          }

          const response = yield* snsClient.get(`/resolve/${domain}`)
          const result = yield* HttpClientResponse.schemaBodyJson(SnsResolveResponse)(response)

          if (result.s === 'error' || result.result === 'Data not found') {
            throw new SnsDomainNotFound({ domain })
          }

          return new SnsSearchResult({ address: result.result })
        }).pipe(
          Effect.scoped,
          Effect.catchTags({
            ParseError: () => Effect.fail(new SnsServiceUnavailable()),
            RequestError: () => Effect.fail(new SnsServiceUnavailable()),
            ResponseError: () => Effect.fail(new SnsServiceUnavailable()),
          }),
        ),
    }
  }),
}) {}
