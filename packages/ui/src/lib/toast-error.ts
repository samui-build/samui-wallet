import type { ReactNode } from 'react'

import { type ExternalToast, toast } from 'sonner'

export function toastError(message: ReactNode, data?: ExternalToast) {
  toast.error(message, data)
}
