import { HttpApi, OpenApi } from '@effect/platform'
import { DomainApi } from './routes/domain/api.ts'
import { RootApi } from './routes/root/api.ts'

export class Api extends HttpApi.make('api').add(RootApi).add(DomainApi).annotate(OpenApi.Title, 'Samui') {}
