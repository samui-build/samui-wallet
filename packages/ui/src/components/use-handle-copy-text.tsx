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

export interface HandleCopyProps {
  text: string
  timeout?: number
  toast: string
  toastFailed?: string | undefined
}

export function useHandleCopyText() {
  const { t } = useTranslation('ui')
  const [copyTimeout, setCopyTimeout] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  function handleCopySuccess({ timeout = 2000, toast }: Pick<HandleCopyProps, 'timeout' | 'toast'>) {
    if (copyTimeout) {
      window.clearTimeout(copyTimeout)
    }
    setCopyTimeout(window.setTimeout(() => setCopied(false), timeout))
    setCopied(true)
    toastSuccess(toast)
  }

  async function handleCopy({ text, timeout = 2000, toast, toastFailed }: HandleCopyProps) {
    try {
      await handleCopyText(text)
      handleCopySuccess({ timeout, toast })
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
