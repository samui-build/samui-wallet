// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- https://github.com/aklinker1/webext-core/pull/117
import { defineProxyService } from '@webext-core/proxy-service'
import { db } from '@workspace/db/db'

export const [registerDbService, getDbService] = defineProxyService('DbService', () => ({
  clusters: async () => await db.clusters.toArray(),
}))
