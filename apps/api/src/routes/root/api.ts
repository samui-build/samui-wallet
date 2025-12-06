import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform'
import { Schema } from 'effect'

export class RootApi extends HttpApiGroup.make('Root').add(
  HttpApiEndpoint.get('health', '/').annotate(OpenApi.Summary, 'Health Check').addSuccess(Schema.String),
) {}
