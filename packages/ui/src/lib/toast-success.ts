import type { ReactNode } from 'react'

import { type ExternalToast, toast } from 'sonner'

export function toastSuccess(message: ReactNode, data?: ExternalToast) {
  toast.success(message, data)
}
