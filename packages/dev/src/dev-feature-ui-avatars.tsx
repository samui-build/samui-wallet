import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { UiAvatar } from '@workspace/ui/components/ui-avatar'

export function DevFeatureUiAvatars() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ui avatars</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-4 justify-items-center">
        <UiAvatar className="size-16" label="beeman" />
        <UiAvatar className="size-16" label="tobeycodes" />
        <UiAvatar className="size-16" label="beeman" src="https://github.com/beeman.png" />
        <UiAvatar className="size-16" label="tobeycodes" src="https://github.com/tobeycodes.png" />
      </CardContent>
    </Card>
  )
}
