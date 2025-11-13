import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup, HttpServer } from '@effect/platform'
import { Effect, Layer, Schema } from 'effect'

const MyApi = HttpApi.make('MyApi').add(
  HttpApiGroup.make('HelloWorld').add(HttpApiEndpoint.get('hello-world')`/`.addSuccess(Schema.String)),
)

const HelloWorldLive = HttpApiBuilder.group(MyApi, 'HelloWorld', (handlers) =>
  handlers.handle('hello-world', () => Effect.succeed('Hello, World!')),
)

const MyApiLive = HttpApiBuilder.api(MyApi).pipe(Layer.provide(HelloWorldLive))

export default {
  fetch: (request: Request, env: Cloudflare.Env) => {
    const { handler } = HttpApiBuilder.toWebHandler(
      Layer.mergeAll(
        MyApiLive,
        HttpApiBuilder.middlewareCors({
          allowedOrigins: env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? [],
          credentials: true,
          maxAge: 86400,
        }),
        HttpServer.layerContext,
      ),
    )
    return handler(request)
  },
}
