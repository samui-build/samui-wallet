export async function handleCopyText(text: string) {
  if (!text) {
    return
  }
  let clipboardError: unknown
  if (globalThis.navigator?.clipboard?.writeText) {
    try {
      await globalThis.navigator.clipboard.writeText(text)
      return
    } catch (error) {
      if (!isClipboardWritePermissionDenied(error)) {
        throw error
      }
      clipboardError = error
    }
  }
  if (copyTextWithExecCommand(text)) {
    return
  }
  throw clipboardError instanceof Error ? clipboardError : new Error('Clipboard API is not available')
}

function copyTextWithExecCommand(text: string) {
  if (!globalThis.document?.body?.appendChild || !globalThis.document.execCommand) {
    return false
  }
  const textArea = globalThis.document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.left = '0'
  textArea.style.opacity = '0'
  textArea.style.pointerEvents = 'none'
  textArea.style.position = 'fixed'
  textArea.style.top = '0'
  globalThis.document.body.appendChild(textArea)
  try {
    textArea.focus()
    textArea.select()
    textArea.setSelectionRange(0, text.length)
    return globalThis.document.execCommand('copy')
  } catch {
    return false
  } finally {
    textArea.remove()
  }
}

function isClipboardWritePermissionDenied(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }
  return (
    (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'NotAllowedError') ||
    error.message.includes('Write permission denied')
  )
}
