import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import type { ChangeEvent, FormEvent } from 'react'
import { useId } from 'react'
import type { VaultUnlockDialogActions, VaultUnlockDialogState } from '../data-access/use-vault-unlock-provider.ts'

export type VaultUiUnlockDialogProps = {
  actions: VaultUnlockDialogActions
  state: VaultUnlockDialogState
}

export function VaultUiUnlockDialog({
  actions: { cancel, changeConfirmPassword, changeCredential, changeOpen, submit: submitUnlock },
  state: {
    cancelLabel,
    confirmPassword,
    confirmPasswordLabel,
    credential,
    credentialInputType,
    credentialLabel,
    description,
    error,
    isOpen,
    isSetupMode,
    isSubmitting,
    submitLabel,
    title,
  },
}: VaultUiUnlockDialogProps) {
  const confirmPasswordId = useId()
  const credentialId = useId()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    submitUnlock()
  }

  function updateConfirmPassword(event: ChangeEvent<HTMLInputElement>) {
    changeConfirmPassword(event.target.value)
  }

  function updateCredential(event: ChangeEvent<HTMLInputElement>) {
    changeCredential(event.target.value)
  }

  return (
    <Dialog onOpenChange={changeOpen} open={isOpen}>
      <DialogContent>
        <form className="space-y-4" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={credentialId}>{credentialLabel}</Label>
            <Input
              autoComplete={isSetupMode ? 'new-password' : 'current-password'}
              autoFocus
              id={credentialId}
              onChange={updateCredential}
              type={credentialInputType}
              value={credential}
            />
          </div>
          {isSetupMode ? (
            <div className="space-y-2">
              <Label htmlFor={confirmPasswordId}>{confirmPasswordLabel}</Label>
              <Input
                autoComplete="new-password"
                id={confirmPasswordId}
                onChange={updateConfirmPassword}
                type="password"
                value={confirmPassword}
              />
            </div>
          ) : null}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <DialogFooter>
            <Button disabled={isSubmitting} onClick={cancel} type="button" variant="outline">
              {cancelLabel}
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
