import { useMutation } from '@tanstack/react-query'
import { getVaultRuntimeService } from '@workspace/background/services/vault'
import { toastError } from '@workspace/ui/lib/toast-error'
import type { SyntheticEvent } from 'react'
import { useRef, useState } from 'react'

export type RequestUnlockMode = 'password' | 'pin' | 'unsecured'

export type RequestSignApproval = {
  actions: {
    cancelUnlock(): void
    changeCredential(value: string): void
    changeOpen(open: boolean): void
    submitUnlock(event: SyntheticEvent<HTMLFormElement>): Promise<void>
  }
  approve(action: () => Promise<void>): Promise<void>
  state: {
    credential: string
    error: string | null
    isApproving: boolean
    isBusy: boolean
    isChecking: boolean
    isOpen: boolean
    isUnlocking: boolean
    mode: RequestUnlockMode
  }
}

export function useRequestSignApproval(): RequestSignApproval {
  const pendingApprovalRef = useRef<(() => Promise<void>) | null>(null)
  const [credential, setCredential] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<RequestUnlockMode>('password')
  const approvalActionMutation = useMutation({
    mutationFn: async (action: () => Promise<void>) => await runApproval(action),
  })
  const approveMutation = useMutation({
    mutationFn: async (action: () => Promise<void>) => {
      const vault = getVaultRuntimeService()
      const isUnlocked = await vault.isActiveWalletUnlocked()
      if (isUnlocked) {
        return { action, type: 'approve' as const }
      }

      const nextMode = await vault.activeWalletProtectionMode()
      if (nextMode === 'unsecured') {
        await vault.unlockActiveWallet({ credential: '' })
        return { action, type: 'approve' as const }
      }

      return { action, mode: nextMode, type: 'unlock' as const }
    },
    onError: (caught) => toastError(caught instanceof Error ? caught.message : `${caught}`),
  })
  const unlockMutation = useMutation({
    mutationFn: async (nextCredential: string) =>
      await getVaultRuntimeService().unlockActiveWallet({ credential: nextCredential }),
  })
  const error = unlockMutation.error
    ? unlockMutation.error instanceof Error
      ? unlockMutation.error.message
      : `${unlockMutation.error}`
    : null
  const isApproving = approvalActionMutation.isPending
  const isChecking = approveMutation.isPending
  const isUnlocking = unlockMutation.isPending
  const isBusy = isApproving || isChecking || isUnlocking

  async function approve(action: () => Promise<void>) {
    if (isBusy) {
      return
    }

    approvalActionMutation.reset()
    approveMutation.reset()
    unlockMutation.reset()
    const result = await approveMutation.mutateAsync(action).catch(() => null)
    if (!result) {
      return
    }

    if (result.type === 'approve') {
      await approvalActionMutation.mutateAsync(result.action).catch(() => {})
      return
    }

    pendingApprovalRef.current = result.action
    setCredential('')
    setMode(result.mode)
    setIsOpen(true)
  }

  function changeCredential(value: string) {
    setCredential(value)
    if (!unlockMutation.isPending) {
      unlockMutation.reset()
    }
  }

  function cancelUnlock() {
    pendingApprovalRef.current = null
    setCredential('')
    unlockMutation.reset()
    setIsOpen(false)
  }

  function changeOpen(open: boolean) {
    if (!open) {
      cancelUnlock()
    }
  }

  async function submitUnlock(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isUnlocking) {
      return
    }

    const action = pendingApprovalRef.current
    if (!action) {
      cancelUnlock()
      return
    }

    try {
      await unlockMutation.mutateAsync(credential)
    } catch {
      return
    }

    if (pendingApprovalRef.current !== action) {
      return
    }

    cancelUnlock()
    await approvalActionMutation.mutateAsync(action).catch(() => {})
  }

  return {
    actions: {
      cancelUnlock,
      changeCredential,
      changeOpen,
      submitUnlock,
    },
    approve,
    state: {
      credential,
      error,
      isApproving,
      isBusy,
      isChecking,
      isOpen,
      isUnlocking,
      mode,
    },
  }
}

async function runApproval(action: () => Promise<void>) {
  try {
    await action()
  } catch (caught) {
    toastError(caught instanceof Error ? caught.message : `${caught}`)
  }
}
