import type { ReactNode } from 'react'

import { toast } from 'sonner'

export function toastSuccess(message: ReactNode) {
  toast.success(message)
}
