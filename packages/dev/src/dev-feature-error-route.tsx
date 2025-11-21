import { useEffect } from 'react'

export function DevFeatureErrorRoute() {
  useEffect(() => {
    throw new Error(`I am an error route :(`)
  }, [])
  return (
    <div className="space-y-6">
      <div>Route Error</div>
    </div>
  )
}
