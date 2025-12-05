import { HttpApiBuilder, HttpServer } from '@effect/platform'
import { Layer } from 'effect'
import { ApiLive } from './http.ts'

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
