/*
 * Uses logic from https://github.com/mantinedev/mantine
 * https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/hooks/src/use-clipboard/use-clipboard.ts
 * MIT License
 * Copyright (c) 2021 Vitaly Rtishchev
 */
import { useTranslation } from '@workspace/i18n'
import { useEffect, useState } from 'react'
import { handleCopyText } from '../lib/handle-copy-text.ts'
import { toastError } from '../lib/toast-error.ts'
import { toastSuccess } from '../lib/toast-success.ts'

export interface HandleCopyTextProps {
  text: string
  timeout?: number
  toast: string
  toastFailed?: string | undefined
}

export function useHandleCopyText({ text, timeout = 2000, toast, toastFailed }: HandleCopyTextProps) {
  const { t } = useTranslation('ui')
  const [copyTimeout, setCopyTimeout] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  function handleCopySuccess() {
    if (copyTimeout) {
      window.clearTimeout(copyTimeout)
    }
    setCopyTimeout(window.setTimeout(() => setCopied(false), timeout))
    setCopied(true)
    toastSuccess(toast)
  }

  async function handleCopy() {
    try {
      await handleCopyText(text)
      handleCopySuccess()
    } catch (error) {
      toastError(error instanceof Error ? error.message : (toastFailed ?? t(($) => $.textCopyFailed)))
    }
  }

  useEffect(() => {
    return () => {
      if (copyTimeout) {
        window.clearTimeout(copyTimeout)
      }
    }
  }, [copyTimeout])

  return {
    copied,
    handleCopy,
  }
}
