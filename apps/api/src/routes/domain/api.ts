import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform'
import { Schema } from 'effect'

export class DomainApi extends HttpApiGroup.make('Domain').add(
  HttpApiEndpoint.get('domainSearch', '/domain/search')
    .annotate(OpenApi.Summary, 'Search domain name')
    .addSuccess(Schema.String),
) {}
