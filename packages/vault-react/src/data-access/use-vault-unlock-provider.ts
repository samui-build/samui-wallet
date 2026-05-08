import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import { useCallback, useMemo, useRef, useState } from 'react'
import { optionsVault, vaultStatusQueryKey } from './options-vault.ts'
import type { VaultUnlockDialogContext, VaultUnlockRequest } from './use-vault-unlock-dialog.ts'
import { useVaultUnlockDialogCopy } from './use-vault-unlock-dialog-copy.ts'
import { submitVaultPassword } from './vault-password-submit.ts'

export interface VaultUnlockDialogActions {
  cancel(): void
  changeConfirmPassword(value: string): void
  changeCredential(value: string): void
  changeOpen(open: boolean): void
  submit(): void
}

export interface VaultUnlockDialogState {
  cancelLabel: string
  confirmPassword: string
  confirmPasswordLabel: string
  credential: string
  credentialInputType: 'password' | 'text'
  credentialLabel: string
  description: string
  error: string | null
  isOpen: boolean
  isSetupMode: boolean
  isSubmitting: boolean
  submitLabel: string
  title: string
}

export interface VaultUnlockProviderValue {
  actions: VaultUnlockDialogActions
  contextValue: VaultUnlockDialogContext
  state: VaultUnlockDialogState
}

type PendingVaultUnlockRequest = Required<Pick<VaultUnlockRequest, 'mode'>> &
  Omit<VaultUnlockRequest, 'mode'> & {
    resolve: (value: boolean) => void
  }

type VaultUnlockSubmitInput = {
  confirmPassword: string
  credential: string
  pending: PendingVaultUnlockRequest
  setupMode: boolean
}

export function useVaultUnlockProvider(): VaultUnlockProviderValue {
  const context = useAppContext()
  const copy = useVaultUnlockDialogCopy()
  const pendingRef = useRef<PendingVaultUnlockRequest | null>(null)
  const queryClient = useQueryClient()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [credential, setCredential] = useState('')
  const [pending, setPending] = useState<PendingVaultUnlockRequest | null>(null)
  const [setupMode, setSetupMode] = useState(false)
  const {
    error: unlockError,
    isPending: isSubmitting,
    mutate: submitUnlock,
    reset: resetSubmitUnlock,
  } = useMutation({
    mutationFn: async ({ confirmPassword, credential, pending, setupMode }: VaultUnlockSubmitInput) => {
      if (setupMode || pending.mode === 'password') {
        await submitVaultPassword(context.vault, {
          confirmPassword: setupMode ? confirmPassword : undefined,
          password: credential,
        })
      } else {
        if (!pending.walletId) {
          throw new Error('Wallet id is required')
        }
        await context.vault.unlockWallet({ credential, walletId: pending.walletId })
      }
      await queryClient.invalidateQueries({ queryKey: vaultStatusQueryKey })
    },
  })

  const resetForm = useCallback(() => {
    setConfirmPassword('')
    setCredential('')
    resetSubmitUnlock()
    setSetupMode(false)
  }, [resetSubmitUnlock])

  const close = useCallback(
    (value: boolean) => {
      const request = pendingRef.current
      pendingRef.current = null
      setPending(null)
      resetForm()
      request?.resolve(value)
    },
    [resetForm],
  )

  const resetSubmitError = useCallback(() => {
    if (!isSubmitting) {
      resetSubmitUnlock()
    }
  }, [isSubmitting, resetSubmitUnlock])

  const changeConfirmPassword = useCallback(
    (value: string) => {
      setConfirmPassword(value)
      resetSubmitError()
    },
    [resetSubmitError],
  )

  const changeCredential = useCallback(
    (value: string) => {
      setCredential(value)
      resetSubmitError()
    },
    [resetSubmitError],
  )

  const changeOpen = useCallback(
    (open: boolean) => {
      if (!open) {
        close(false)
      }
    },
    [close],
  )

  const requestUnlock = useCallback(
    async (input: VaultUnlockRequest = {}): Promise<boolean> => {
      const mode = input.mode ?? 'password'

      if (mode === 'unsecured') {
        if (!input.walletId) {
          return true
        }
        try {
          await context.vault.unlockWallet({ credential: '', walletId: input.walletId })
          return true
        } catch {
          return false
        }
      }

      if (input.walletId) {
        try {
          await context.vault.requireWalletKey({ walletId: input.walletId })
          return true
        } catch {
          // Continue into the dialog.
        }
      } else if (mode === 'password' && context.vault.isUnlocked()) {
        return true
      }

      // requestUnlock is single-flight: pendingRef.current means another dialog is already open, so
      // return false to mark this request as ignored rather than queueing subsequent requests.
      if (pendingRef.current) {
        return false
      }

      const request: PendingVaultUnlockRequest = {
        ...input,
        mode,
        resolve: () => undefined,
      }
      const promise = new Promise<boolean>((resolve) => {
        request.resolve = resolve
      })

      pendingRef.current = request

      try {
        const status = await queryClient.fetchQuery(optionsVault.status(context))
        setSetupMode(!status.isConfigured)
        setPending(request)
      } catch (error) {
        pendingRef.current = null
        setPending(null)
        request.resolve(false)
        throw error
      }

      return promise
    },
    [context, queryClient],
  )

  const submit = useCallback(() => {
    if (!pending || isSubmitting) {
      return
    }

    submitUnlock(
      { confirmPassword, credential, pending, setupMode },
      {
        onSuccess: () => close(true),
      },
    )
  }, [close, confirmPassword, credential, isSubmitting, pending, setupMode, submitUnlock])

  const contextValue = useMemo<VaultUnlockDialogContext>(() => ({ requestUnlock }), [requestUnlock])
  const error = unlockError ? (unlockError instanceof Error ? unlockError.message : 'Unable to unlock') : null

  return {
    actions: {
      cancel: () => close(false),
      changeConfirmPassword,
      changeCredential,
      changeOpen,
      submit,
    },
    contextValue,
    state: {
      cancelLabel: copy.actionCancel,
      confirmPassword,
      confirmPasswordLabel: copy.confirmPasswordLabel,
      credential,
      credentialInputType: pending?.mode === 'pin' ? 'text' : 'password',
      credentialLabel: pending?.mode === 'pin' ? copy.pinLabel : copy.passwordLabel,
      description: setupMode ? copy.setupDescription : (pending?.description ?? copy.defaultDescription),
      error,
      isOpen: Boolean(pending),
      isSetupMode: setupMode,
      isSubmitting,
      submitLabel: copy.actionContinue,
      title: setupMode ? copy.setupTitle : (pending?.title ?? copy.defaultTitle),
    },
  }
}
