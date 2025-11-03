export async function handleTextPaste(): Promise<string> {
  if (
    typeof globalThis === 'undefined' ||
    !globalThis.navigator ||
    !globalThis.navigator.clipboard ||
    !globalThis.navigator.clipboard.readText
  ) {
    throw new Error('Clipboard API is not available')
  }
  return globalThis.navigator.clipboard.readText()
}
