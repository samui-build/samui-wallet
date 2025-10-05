import { Button } from '@workspace/ui/components/button.js'
import { Card, CardContent } from '@workspace/ui/components/card.js'
import { Link } from 'react-router'

export function OnboardingFeatureIndex() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-2xl">Welcome to Samui Wallet</div>
            <div className="text-lg text-muted-foreground">We hope you enjoy your stay 🏝️</div>
          </div>
          {/* TODO: Add 'Accept Terms of Service' */}
          <div className="flex flex-col space-y-2 w-full">
            <Button asChild>
              <Link to="generate">Create a new wallet</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="import">I already have a wallet</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
