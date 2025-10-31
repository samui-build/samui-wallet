import type { ReactNode } from 'react'

import { toast } from 'sonner'

export function toastError(message: ReactNode) {
  toast.error(message)
}
