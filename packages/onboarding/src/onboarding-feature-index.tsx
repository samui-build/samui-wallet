import { Button } from '@workspace/ui/components/button'
import { UiExperimentalWarning } from '@workspace/ui/components/ui-experimental-warning'
import { useState } from 'react'
import { Link } from 'react-router'

export function OnboardingFeatureIndex() {
  const [accepted, setAccepted] = useState(false)
  return (
    <div className="flex flex-col gap-6 items-center min-w-[400px]">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-2xl">Welcome to 🏝️ Samui Wallet</div>
        <div className="text-lg text-muted-foreground">We hope you enjoy your stay!</div>
      </div>
      {accepted ? null : <UiExperimentalWarning close={() => setAccepted(true)} />}
      <div className="flex flex-col space-y-2 w-full">
        <Button asChild>
          <Link to="generate">Create a new wallet</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="import">I already have a wallet</Link>
        </Button>
      </div>
    </div>
  )
}
