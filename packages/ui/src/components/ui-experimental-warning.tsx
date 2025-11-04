import { AlertTriangle, LucideX } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from './alert.tsx'
import { Button } from './button.tsx'

export function UiExperimentalWarning({ close }: { close?: () => void }) {
  return (
    <Alert className="rounded-none border-1 border-yellow-500 bg-yellow-500/10 text-yellow-500">
      <AlertTriangle />
      <AlertTitle>This is experimental software.</AlertTitle>
      <AlertDescription>Use this wallet at your own risk. Do not use any real funds.</AlertDescription>
      {close ? (
        <Button className="absolute top-2 right-2" onClick={() => close()} size="icon" variant="ghost">
          <LucideX />
        </Button>
      ) : null}
    </Alert>
  )
}
