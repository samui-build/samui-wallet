import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  SettingsUiWalletFormGenerateVanity,
  type VanityWalletFormInput,
} from './ui/settings-ui-wallet-form-generate-vanity.tsx'

export function SettingsFeatureWalletGenerateVanity() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ address: string; secretKey: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [count, setCount] = useState(0)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  const handleGenerate = async (input: VanityWalletFormInput) => {
    setIsGenerating(true)
    setError(null)
    setResult(null)
    setShowSecret(false)
    setCount(0)

    try {
      workerRef.current?.terminate()
      const worker = new Worker(new URL('./workers/vanity-worker.ts', import.meta.url), { type: 'module' })
      workerRef.current = worker

      worker.onmessage = (event) => {
        const { type, payload } = event.data ?? {}
        if (type === 'progress' && typeof payload === 'number') {
          setCount(payload)
          return
        }
        if (type === 'found' && payload) {
          setResult({
            address: payload.address,
            secretKey: payload.secretKey,
          })
          if (typeof payload.attempts === 'number') {
            setCount(payload.attempts)
          }
          setIsGenerating(false)
          workerRef.current?.terminate()
          workerRef.current = null
          return
        }
        if (type === 'error') {
          setError(typeof payload === 'string' ? payload : 'Failed to generate vanity address')
          setIsGenerating(false)
          workerRef.current?.terminate()
          workerRef.current = null
        }
      }

      worker.onerror = (event) => {
        setError(event.message ?? 'Worker error')
        setIsGenerating(false)
        workerRef.current?.terminate()
        workerRef.current = null
      }

      worker.postMessage(input)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start worker')
      setIsGenerating(false)
    }
  }

  const handleCancel = () => {
    workerRef.current?.terminate()
    workerRef.current = null
    setIsGenerating(false)
  }

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
              <Button onClick={() => setResult(null)} variant="outline">
                Try Again
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(result.secretKey)
                  toastSuccess('Secret key copied to clipboard')
                  navigate('/settings/wallets/import')
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
