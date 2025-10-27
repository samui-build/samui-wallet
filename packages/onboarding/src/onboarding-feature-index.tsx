import { Button } from '@workspace/ui/components/button'
import { Link } from 'react-router'

export function OnboardingFeatureIndex() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="text-2xl font-bold">Onboarding</div>
      <div className="space-x-2">
        <Button asChild>
          <Link to="generate">Generate</Link>
        </Button>
        <Button asChild>
          <Link to="import">Import</Link>
        </Button>
      </div>
    </div>
  )
}
