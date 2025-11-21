import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  SettingsUiWalletFormGenerateVanity,
  type VanityWalletFormFields,
} from './ui/settings-ui-wallet-form-generate-vanity.tsx'

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

  const start = useCallback(async (input: VanityWalletFormFields) => {
    const sanitizedPrefix = input.prefix?.trim() ?? ''
    const sanitizedSuffix = input.suffix?.trim() ?? ''
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
  }, [])

  const cancel = useCallback(() => {
    workerRef.current?.terminate()
    workerRef.current = null
    dispatch({ type: 'reset' })
  }, [])

  return { cancel, start, state }
}

export function SettingsFeatureWalletGenerateVanity() {
  const navigate = useNavigate()
  const { cancel, start, state } = useVanityGenerator()
  const [showSecret, setShowSecret] = useState(false)

  const handleGenerate = useCallback(
    async (input: VanityWalletFormFields) => {
      setShowSecret(false)
      await start(input)
    },
    [start],
  )

  const handleCancel = useCallback(() => {
    setShowSecret(false)
    cancel()
  }, [cancel])

  const isGenerating = state.status === 'pending'
  const result = state.status === 'success' ? state.result : null
  const error = state.error
  const count = state.attempts

  return (
    <UiCard backButtonTo="/settings/wallets/create" title="Generate Vanity Wallet">
      <div className="grid gap-6">
        <Alert>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Generating runs on the main thread for now.
            <strong>Long prefixes/suffixes will freeze the browser!</strong>
            <br />
            Use short patterns (1-3 characters) for best results.
          </AlertDescription>
        </Alert>

        {!result ? (
          <div className="space-y-6">
            <SettingsUiWalletFormGenerateVanity disabled={isGenerating} submit={handleGenerate} />

            {isGenerating && (
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
              <Button
                onClick={async () => {
                  await navigator.clipboard.writeText(result.secretKey)
                  toastSuccess('Secret key copied to clipboard')
                  await navigate('/settings/wallets/import')
                }}
              >
                Copy & Import
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </UiCard>
  )
}
