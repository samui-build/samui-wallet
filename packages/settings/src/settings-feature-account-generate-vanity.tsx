import { assertIsAddress } from '@solana/kit'
import { useAccountCreate } from '@workspace/db-react/use-account-create'
import { useWalletFindUnique } from '@workspace/db-react/use-wallet-find-unique'
import { importKeyPairToPublicKeySecretKey } from '@workspace/keypair/import-key-pair-to-public-key-secret-key'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import {
  SettingsUiWalletFormGenerateVanity,
  type VanityWalletFormFields,
} from './ui/settings-ui-wallet-form-generate-vanity.tsx'
import { SettingsUiWalletItem } from './ui/settings-ui-wallet-item.tsx'
import type { VanityWorkerMessage } from './workers/vanity-worker-message.ts'

type VanityGeneratorState =
  | { attempts: number; error: string | null; result: null; status: 'idle' | 'pending' | 'error' }
  | { attempts: number; error: null; result: { address: string; secretKey: string }; status: 'success' }

type VanityGeneratorAction =
  | { type: 'start' }
  | { payload: number; type: 'progress' }
  | { payload: string; type: 'error' }
  | { payload: { address: string; attempts: number; secretKey: string }; type: 'success' }
  | { type: 'reset' }

const initialVanityGeneratorState: VanityGeneratorState = { attempts: 0, error: null, result: null, status: 'idle' }

function vanityGeneratorReducer(state: VanityGeneratorState, action: VanityGeneratorAction): VanityGeneratorState {
  switch (action.type) {
    case 'start':
      return { attempts: 0, error: null, result: null, status: 'pending' }
    case 'progress':
      return { ...state, attempts: action.payload }
    case 'success':
      return {
        attempts: action.payload.attempts,
        error: null,
        result: { address: action.payload.address, secretKey: action.payload.secretKey },
        status: 'success',
      }
    case 'error':
      return { attempts: 0, error: action.payload, result: null, status: 'error' }
    case 'reset':
      return initialVanityGeneratorState
    default:
      return state
  }
}

function useVanityGenerator() {
  const workerRef = useRef<Worker | null>(null)
  const [state, dispatch] = useReducer(vanityGeneratorReducer, initialVanityGeneratorState)

  useEffect(() => {
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  const start = async (input: VanityWalletFormFields) => {
    const sanitizedPrefix = input.prefix?.trim().slice(0, 4) ?? ''
    const sanitizedSuffix = input.suffix?.trim().slice(0, 4) ?? ''
    const payload = {
      caseSensitive: input.caseSensitive ?? true,
      prefix: sanitizedPrefix,
      suffix: sanitizedSuffix,
    }

    dispatch({ type: 'start' })
    workerRef.current?.terminate()
    const worker = new Worker(new URL('./workers/vanity-worker.ts', import.meta.url), { type: 'module' })
    workerRef.current = worker

    worker.onmessage = (event: MessageEvent<VanityWorkerMessage>) => {
      const { type, payload } = event.data
      if (type === 'progress') {
        dispatch({ payload, type: 'progress' })
        return
      }
      if (type === 'found') {
        dispatch({
          payload: {
            address: payload.address,
            attempts: payload.attempts ?? 0,
            secretKey: payload.secretKey,
          },
          type: 'success',
        })
        workerRef.current?.terminate()
        workerRef.current = null
        return
      }
      if (type === 'error') {
        dispatch({
          payload,
          type: 'error',
        })
        workerRef.current?.terminate()
        workerRef.current = null
      }
    }

    worker.onerror = (event) => {
      dispatch({ payload: event.message ?? 'Worker error', type: 'error' })
      workerRef.current?.terminate()
      workerRef.current = null
    }

    worker.postMessage(payload)
  }

  const cancel = () => {
    workerRef.current?.terminate()
    workerRef.current = null
    dispatch({ type: 'reset' })
  }

  return { cancel, start, state }
}

export function SettingsFeatureAccountGenerateVanity() {
  const navigate = useNavigate()
  const { walletId } = useParams() as { walletId: string }
  const { data: wallet, error: walletError, isError, isLoading } = useWalletFindUnique({ id: walletId })
  const createAccountMutation = useAccountCreate()
  const { cancel, start, state } = useVanityGenerator()
  const [showSecret, setShowSecret] = useState(false)

  const handleGenerate = async (input: VanityWalletFormFields) => {
    setShowSecret(false)
    await start(input)
  }

  const handleCancel = () => {
    setShowSecret(false)
    cancel()
  }

  const isPending = state.status === 'pending'
  const { attempts, error: generationError, result } = state

  if (isLoading) {
    return <UiLoader />
  }

  if (isError) {
    return <UiError message={walletError} />
  }

  if (!wallet) {
    return <UiNotFound />
  }

  const handleImport = async () => {
    if (!result) {
      return
    }

    try {
      const { publicKey, secretKey } = await importKeyPairToPublicKeySecretKey(result.secretKey, true)
      assertIsAddress(publicKey)
      await createAccountMutation.mutateAsync({
        input: {
          name: ellipsify(publicKey),
          publicKey,
          secretKey,
          type: 'Imported',
          walletId: wallet.id,
        },
      })
      toastSuccess('Vanity account imported')
      await navigate(`/settings/wallets/${wallet.id}`)
    } catch (copyError) {
      toastError(copyError instanceof Error ? copyError.message : 'Failed to import vanity account')
    }
  }

  return (
    <UiCard
      backButtonTo={`/settings/wallets/${wallet.id}/add`}
      description="Generate a vanity account for this wallet"
      title={<SettingsUiWalletItem item={wallet} />}
    >
      <div className="grid gap-6">
        <Alert>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Vanity searches are limited to short patterns (max 4 characters) and will stop after 20,000,000 attempts.
            <br />
            Use concise prefixes or suffixes for the fastest results.
          </AlertDescription>
        </Alert>

        {result ? (
          <div className="fade-in slide-in-from-bottom-4 grid animate-in gap-4 rounded-lg border p-4">
            <div className="grid gap-2">
              <h3 className="font-medium">Found Address!</h3>
              <div className="break-all rounded border bg-muted p-3 font-mono text-sm">{result.address}</div>
              {attempts > 0 ? (
                <p className="text-muted-foreground text-xs">
                  Found after checking {attempts.toLocaleString()} accounts.
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Secret Key JSON</h3>
                <div className="flex items-center gap-2">
                  <UiTextCopyButton
                    label="Copy"
                    text={result.secretKey}
                    toast="Secret key copied"
                    toastFailed="Failed to copy secret key"
                  />
                  <Button onClick={() => setShowSecret(!showSecret)} size="sm" variant="ghost">
                    {showSecret ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              {showSecret ? (
                <div className="break-all rounded border bg-muted p-3 font-mono text-muted-foreground text-xs">
                  {result.secretKey}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleCancel} variant="outline">
                Try Again
              </Button>
              <Button disabled={createAccountMutation.isPending} onClick={handleImport}>
                {createAccountMutation.isPending ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <SettingsUiWalletFormGenerateVanity disabled={isPending} submit={handleGenerate} />

            {isPending ? (
              <div className="fade-in flex animate-in flex-col items-center justify-center gap-3 rounded-lg border bg-muted/50 p-6 text-center">
                <div className="font-bold font-mono text-3xl">{attempts.toLocaleString()}</div>
                <p className="text-muted-foreground text-sm">Accounts checked</p>
                <Button onClick={handleCancel} variant="destructive">
                  Stop Generation
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {generationError ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{generationError}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </UiCard>
  )
}
