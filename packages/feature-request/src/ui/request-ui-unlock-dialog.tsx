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
import { useId } from 'react'
import type { RequestSignApproval, RequestUnlockMode } from '../data-access/use-request-sign-approval.tsx'

export function RequestUiUnlockDialog({ approval }: { approval: RequestSignApproval }) {
  const credentialId = useId()
  const { actions, state } = approval

  return (
    <Dialog onOpenChange={actions.changeOpen} open={state.isOpen}>
      <DialogContent>
        <form className="space-y-4" onSubmit={actions.submitUnlock}>
          <DialogHeader>
            <DialogTitle>Unlock wallet</DialogTitle>
            <DialogDescription>Unlock the active wallet to continue with this signing request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={credentialId}>{getCredentialLabel(state.mode)}</Label>
            <Input
              autoComplete={state.mode === 'password' ? 'current-password' : 'off'}
              id={credentialId}
              inputMode={state.mode === 'pin' ? 'numeric' : undefined}
              onChange={(event) => actions.changeCredential(event.target.value)}
              pattern={state.mode === 'pin' ? '[0-9]*' : undefined}
              type={state.mode === 'pin' ? 'text' : 'password'}
              value={state.credential}
            />
          </div>
          {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}
          <DialogFooter>
            <Button disabled={state.isUnlocking} onClick={actions.cancelUnlock} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={state.isUnlocking} type="submit" variant="destructive">
              {state.isUnlocking ? 'Unlocking...' : 'Unlock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function getCredentialLabel(mode: RequestUnlockMode): string {
  switch (mode) {
    case 'password':
      return 'Password'
    case 'pin':
      return 'PIN'
    case 'unsecured':
      return 'Wallet'
  }
}
