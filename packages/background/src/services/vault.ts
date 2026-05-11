import type { ProxyService, ProxyServiceKey } from '@webext-core/proxy-service'
import { createProxyService, registerService } from '@webext-core/proxy-service'
import type { AppContext } from '@workspace/context/app-context'
import { tryCatch } from '@workspace/core/try-catch'
import type { Account } from '@workspace/db/account/account'
import { accountFindUnique } from '@workspace/db/account/account-find-unique'
import { settingFindUnique } from '@workspace/db/setting/setting-find-unique'
import type { Wallet, WalletProtectionMode } from '@workspace/db/wallet/wallet'
import { walletFindUnique } from '@workspace/db/wallet/wallet-find-unique'

function createVaultRuntimeService(ctx: AppContext) {
  return {
    activeWalletProtectionMode: async (): Promise<WalletProtectionMode> => {
      const wallet = await findActiveWallet(ctx)
      return wallet?.protectionMode ?? 'password'
    },
    isActiveWalletUnlocked: async (): Promise<boolean> => {
      const account = await findActiveAccount(ctx)
      if (!account) {
        return ctx.vault.isUnlocked()
      }

      const wallet = await walletFindUnique(ctx, account.walletId)
      if (wallet?.protectionMode === 'unsecured') {
        return true
      }

      const { error } = await tryCatch(ctx.vault.requireWalletKey({ walletId: account.walletId }))
      return !error
    },
    isConfigured: async (): Promise<boolean> => await ctx.vault.isConfigured(),
    lock: (): void => ctx.vault.lock(),
    unlock: async (input: { password: string }): Promise<void> => await ctx.vault.unlock(input),
    unlockActiveWallet: async (input: { credential: string }): Promise<void> => {
      const account = await findActiveAccount(ctx)
      if (!account) {
        await ctx.vault.unlock({ password: input.credential })
        return
      }

      const wallet = await walletFindUnique(ctx, account.walletId)
      if (!wallet || wallet.protectionMode === 'password') {
        await ctx.vault.unlock({ password: input.credential })
        return
      }

      await ctx.vault.unlockWallet({ credential: input.credential, walletId: account.walletId })
    },
  }
}

type VaultRuntimeService = ReturnType<typeof createVaultRuntimeService>

const vaultRuntimeServiceKey = 'VaultRuntimeService' as ProxyServiceKey<VaultRuntimeService>
let vaultRuntimeService: VaultRuntimeService | undefined

async function findActiveAccount(ctx: AppContext): Promise<Account | null> {
  const accountId = (await settingFindUnique(ctx, 'activeAccountId'))?.value
  if (!accountId) {
    return null
  }

  return await accountFindUnique(ctx, accountId)
}

async function findActiveWallet(ctx: AppContext): Promise<Wallet | null> {
  const account = await findActiveAccount(ctx)
  if (!account) {
    return null
  }

  return await walletFindUnique(ctx, account.walletId)
}

export function getVaultRuntimeService(): ProxyService<VaultRuntimeService> {
  return (vaultRuntimeService ?? createProxyService(vaultRuntimeServiceKey)) as ProxyService<VaultRuntimeService>
}

export function registerVaultRuntimeService(ctx: AppContext): VaultRuntimeService {
  vaultRuntimeService = createVaultRuntimeService(ctx)
  registerService(vaultRuntimeServiceKey, vaultRuntimeService)
  return vaultRuntimeService
}
