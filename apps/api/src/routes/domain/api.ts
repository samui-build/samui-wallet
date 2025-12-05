import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import {
  SnsDomainNotFound,
  SnsInvalidDomainName,
  SnsSearchResult,
  SnsServiceUnavailable,
} from '../../services/sns/service.ts'

export const Domain = Schema.String.pipe(Schema.brand('Domain'))

export type Domain = typeof Domain.Type

export class DomainApi extends HttpApiGroup.make('Domain').add(
  HttpApiEndpoint.get('domainSearch', '/domain/:domain')
    .annotate(OpenApi.Summary, 'Search domain name')
    .setPath(Schema.Struct({ domain: Domain }))
    .addSuccess(SnsSearchResult)
    .addError(SnsDomainNotFound, { status: 404 })
    .addError(SnsInvalidDomainName, { status: 400 })
    .addError(SnsServiceUnavailable, { status: 503 }),
) {}
