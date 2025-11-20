import { assertIsAddress } from '@solana/kit'
import { useDbAccountCreate } from '@workspace/db-react/use-db-account-create'
import { useDbWalletFindUnique } from '@workspace/db-react/use-db-wallet-find-unique'
import { importKeyPairToPublicKeySecretKey } from '@workspace/keypair/import-key-pair-to-public-key-secret-key'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import {
  SettingsUiWalletFormGenerateVanity,
  type VanityWalletFormFields,
} from './ui/settings-ui-wallet-form-generate-vanity.tsx'
import { SettingsUiWalletItem } from './ui/settings-ui-wallet-item.tsx'

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

    worker.onmessage = (event) => {
      const { type, payload } = event.data ?? {}
      if (type === 'progress' && typeof payload === 'number') {
        dispatch({ payload, type: 'progress' })
        return
      }
      if (type === 'found' && payload) {
        dispatch({
          payload: {
            address: payload.address,
            attempts: typeof payload.attempts === 'number' ? payload.attempts : 0,
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
          payload: typeof payload === 'string' ? payload : 'Failed to generate vanity address',
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

export function SettingsFeatureWalletAddAccountGenerateVanity() {
  const navigate = useNavigate()
  const { walletId } = useParams() as { walletId: string }
  const { data: wallet, error: walletError, isError, isLoading } = useDbWalletFindUnique({ id: walletId })
  const createAccountMutation = useDbAccountCreate()
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
  const { attempts: count, error: generationError, result } = state

  if (isLoading) {
    return <UiLoader />
  }

  if (isError) {
    return <UiError message={walletError} />
  }

  if (!wallet) {
    return <UiNotFound />
  }

  const handleCopyAndImport = async () => {
    if (!result) {
      return
    }

    try {
      await handleCopyText(result.secretKey)
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
      toastSuccess('Vanity account copied & imported')
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

        {!result ? (
          <div className="space-y-6">
            <SettingsUiWalletFormGenerateVanity disabled={isPending} submit={handleGenerate} />

            {isPending && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-muted/50 p-6 text-center animate-in fade-in">
                <div className="text-3xl font-mono font-bold">{count.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Wallets checked</p>
                <Button onClick={handleCancel} variant="destructive">
                  Stop Generation
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 p-4 border rounded-lg animate-in fade-in slide-in-from-bottom-4">
            <div className="grid gap-2">
              <h3 className="font-medium">Found Address!</h3>
              <div className="font-mono text-sm break-all bg-muted p-3 rounded border">{result.address}</div>
              {count > 0 ? (
                <p className="text-xs text-muted-foreground">Found after checking {count.toLocaleString()} wallets.</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Secret Key JSON</h3>
                <Button onClick={() => setShowSecret(!showSecret)} size="sm" variant="ghost">
                  {showSecret ? 'Hide' : 'Show'}
                </Button>
              </div>
              {showSecret && (
                <div className="font-mono text-xs break-all bg-muted p-3 rounded border text-muted-foreground">
                  {result.secretKey}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleCancel} variant="outline">
                Try Again
              </Button>
              <Button disabled={createAccountMutation.isPending} onClick={handleCopyAndImport}>
                {createAccountMutation.isPending ? 'Importing...' : 'Copy & Import'}
              </Button>
            </div>
          </div>
        )}

        {generationError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{generationError}</AlertDescription>
          </Alert>
        )}
      </div>
    </UiCard>
  )
}
