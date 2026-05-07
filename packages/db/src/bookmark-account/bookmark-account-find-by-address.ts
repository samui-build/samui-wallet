import type { Address } from '@solana/kit'
import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { AppContext } from '../app-context.ts'
import type { BookmarkAccount } from './bookmark-account.ts'

export async function bookmarkAccountFindByAddress(ctx: AppContext, address: Address): Promise<null | BookmarkAccount> {
  return ctx.db.transaction('r', ctx.db.bookmarkAccounts, async () => {
    const data = await tryCatchOrThrow(
      ctx.db.bookmarkAccounts.get({ address }),
      `Error finding bookmark account with address ${address}`,
    )
    return data ? data : null
  })
}
