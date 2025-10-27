export async function handleTextPaste(): Promise<string | void> {
  if (
    typeof globalThis === 'undefined' ||
    !globalThis.navigator ||
    !globalThis.navigator.clipboard ||
    !globalThis.navigator.clipboard.readText
  ) {
    return
  }
  return globalThis.navigator.clipboard.readText()
}
