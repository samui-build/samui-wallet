import { TextAttributes } from '@opentui/core'

export function App() {
  return (
    <box alignItems="center" flexGrow={1} justifyContent="center">
      <box alignItems="flex-end" justifyContent="center">
        <ascii-font font="tiny" text="Samui Wallet" />
        <text attributes={TextAttributes.DIM}>Are you ready?</text>
      </box>
    </box>
  )
}
