import type { ReactNode } from 'react'
import { toast } from 'sonner'

export function toastLoading(message: ReactNode) {
  const toastId = toast.loading(message)
  return {
    dismiss: () => toast.dismiss(toastId),
    toastId,
  }
}
