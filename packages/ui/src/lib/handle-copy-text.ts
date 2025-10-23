export function handleCopyText(text?: string) {
  if (!text) {
    return
  }
  if (
    typeof globalThis === 'undefined' ||
    !globalThis.navigator ||
    !globalThis.navigator.clipboard ||
    !globalThis.navigator.clipboard.writeText
  ) {
    return
  }
  void globalThis.navigator.clipboard.writeText(text)
}
