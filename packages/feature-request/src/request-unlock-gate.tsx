import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getVaultRuntimeService } from '@workspace/background/services/vault'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { toastError } from '@workspace/ui/lib/toast-error'
import type { ReactNode, SubmitEvent } from 'react'
import { useId, useState } from 'react'

type RequestUnlockMode = 'password' | 'pin' | 'unsecured'

const requestUnlockStatusQueryKey = ['requestUnlockStatus'] as const

export function RequestUnlockGate({ children }: { children: ReactNode }) {
  const credentialId = useId()
  const [credential, setCredential] = useState('')
  const queryClient = useQueryClient()
  const statusQuery = useQuery({
    gcTime: 0,
    queryFn: async () => {
      const vault = getVaultRuntimeService()
      const [isUnlocked, mode] = await Promise.all([vault.isActiveWalletUnlocked(), vault.activeWalletProtectionMode()])
      return { isUnlocked, mode }
    },
    queryKey: requestUnlockStatusQueryKey,
    retry: false,
  })
  const mode = statusQuery.data?.mode ?? null
  const unlockMutation = useMutation({
    mutationFn: async (nextCredential: string) => {
      if (!statusQuery.data?.mode) {
        return
      }
      await getVaultRuntimeService().unlockActiveWallet({
        credential: statusQuery.data.mode === 'unsecured' ? '' : nextCredential,
      })
    },
    onError: (caught) => toastError(caught.message),
    onSuccess: () => {
      setCredential('')
      if (statusQuery.data) {
        queryClient.setQueryData(requestUnlockStatusQueryKey, { ...statusQuery.data, isUnlocked: true })
      }
    },
  })
  const autoUnlockQuery = useQuery({
    enabled: statusQuery.data?.isUnlocked === false && statusQuery.data.mode === 'unsecured',
    gcTime: 0,
    queryFn: async () => {
      await getVaultRuntimeService().unlockActiveWallet({ credential: '' })
      return true
    },
    queryKey: [...requestUnlockStatusQueryKey, 'autoUnlock'],
    retry: false,
  })
  const isUnlocked = statusQuery.data?.isUnlocked || autoUnlockQuery.data === true

  if (isUnlocked) {
    return children
  }

  const credentialLabel = mode ? getCredentialLabel(mode) : null
  const isBusy = statusQuery.isLoading || unlockMutation.isPending || autoUnlockQuery.isFetching

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    await unlockMutation.mutateAsync(credential).catch(() => undefined)
  }

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={submit}>
      <h1 className="text-center font-bold text-2xl">Unlock Wallet</h1>
      {credentialLabel ? (
        <div className="space-y-2">
          <Label htmlFor={credentialId}>{credentialLabel}</Label>
          <Input
            autoComplete={mode === 'password' ? 'current-password' : 'off'}
            id={credentialId}
            inputMode={mode === 'pin' ? 'numeric' : undefined}
            onChange={(event) => setCredential(event.target.value)}
            pattern={mode === 'pin' ? '[0-9]*' : undefined}
            type="password"
            value={credential}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Checking wallet lock state.</p>
      )}
      {statusQuery.error ? <p className="text-destructive text-sm">{statusQuery.error.message}</p> : null}
      {autoUnlockQuery.error ? <p className="text-destructive text-sm">{autoUnlockQuery.error.message}</p> : null}
      <Button disabled={isBusy || !mode} type="submit" variant="destructive">
        Unlock
      </Button>
    </form>
  )
}

function getCredentialLabel(mode: RequestUnlockMode): null | string {
  switch (mode) {
    case 'password':
      return 'Password'
    case 'pin':
      return 'PIN'
    case 'unsecured':
      return null
  }
}
