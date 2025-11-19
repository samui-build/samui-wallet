import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup, HttpServer, OpenApi } from '@effect/platform'
import { Effect, Layer, Schema } from 'effect'

const RootApi = HttpApiGroup.make('Root').add(
  HttpApiEndpoint.get('health-check', '/health-check')
    .annotate(OpenApi.Summary, 'Health Check')
    .addSuccess(Schema.String),
)

const Api = HttpApi.make('Samui').annotate(OpenApi.Title, 'Samui API').add(RootApi)

const HttpRootLive = HttpApiBuilder.group(Api, 'Root', (handlers) =>
  handlers.handle('health-check', () => Effect.succeed('Ok')),
)

const ApiLive = HttpApiBuilder.api(Api).pipe(Layer.provide(HttpRootLive))

export default {
  fetch: (request: Request, env: Cloudflare.Env) => {
    const HttpApiLive = Layer.mergeAll(
      ApiLive,
      Layer.provide(HttpApiBuilder.middlewareOpenApi(), ApiLive),
      HttpApiBuilder.middlewareCors({
        allowedOrigins: env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? [],
      }),
      HttpServer.layerContext,
    )

    const { handler } = HttpApiBuilder.toWebHandler(HttpApiLive)
    return handler(request)
  },
}
