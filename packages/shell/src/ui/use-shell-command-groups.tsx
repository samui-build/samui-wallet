import { useShellCommandGroupNavigate } from './use-shell-command-group-navigate.tsx'
import { useShellCommandGroupSuggestions } from './use-shell-command-group-suggestions.tsx'

export interface ShellCommand {
  disabled?: boolean
  handler: () => Promise<void>
  label: string
}

export interface ShellCommandGroup {
  commands: ShellCommand[]
  label: string
}

export function useShellCommandGroups(): ShellCommandGroup[] {
  const suggestions = useShellCommandGroupSuggestions()
  const navigate = useShellCommandGroupNavigate()

  return [suggestions, navigate]
}
