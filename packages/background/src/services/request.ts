import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
  SolanaSignInInput,
  SolanaSignInOutput,
  SolanaSignMessageInput,
  SolanaSignMessageOutput,
  SolanaSignTransactionInput,
  SolanaSignTransactionOutput,
} from '@solana/wallet-standard-features'
import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'

import { defineProxyService } from '@webext-core/proxy-service'
import { browser } from '@wxt-dev/browser'
import { getEntrypoint } from '../entrypoint.ts'
import { sendMessage } from '../extension.ts'

type DataType<T extends Request['type']> = Extract<Request, { type: T }>['data']

type Request =
  | {
      data: SolanaSignAndSendTransactionInput[]
      id?: number
      reject: (reason?: Error) => void
      resolve: (data: SolanaSignAndSendTransactionOutput[]) => void
      type: 'signAndSendTransaction'
    }
  | {
      data: SolanaSignInInput[]
      id?: number
      reject: (reason?: Error) => void
      resolve: (data: SolanaSignInOutput[]) => void
      type: 'signIn'
    }
  | {
      data: SolanaSignMessageInput[]
      id?: number
      reject: (reason?: Error) => void
      resolve: (data: SolanaSignMessageOutput[]) => void
      type: 'signMessage'
    }
  | {
      data: SolanaSignTransactionInput[]
      id?: number
      reject: (reason?: Error) => void
      resolve: (data: SolanaSignTransactionOutput[]) => void
      type: 'signTransaction'
    }
  | {
      data: StandardConnectInput | undefined
      id?: number
      reject: (reason?: Error) => void
      resolve: (data: StandardConnectOutput) => void
      type: 'connect'
    }

type ResolveType<T extends Request['type']> = Extract<Request, { type: T }> extends {
  resolve: (data: infer R) => void
}
  ? R
  : never

class RequestService {
  private request: Request | null = null

  constructor() {
    browser.windows.onRemoved.addListener((windowId: number) => {
      if (this.request && this.request.id === windowId) {
        this.request.reject(new Error('Request closed'))

        this.reset()
      }
    })

    browser.runtime.onConnect.addListener((entrypoint) => {
      if (entrypoint.name !== 'sidepanel') {
        return
      }

      entrypoint.onDisconnect.addListener(() => {
        if (this.request) {
          this.request.reject(new Error('Request closed'))

          this.reset()
        }
      })
    })
  }

  async create<T extends Request['type']>(type: T, data: DataType<T>): Promise<ResolveType<T>> {
    if (this.request) {
      throw new Error('Request already exists')
    }

    const entrypoint = await getEntrypoint()
    const id = entrypoint === 'sidepanel' ? undefined : await this.createPopupWindow()

    return new Promise((resolve, reject) => {
      this.request = {
        data,
        id,
        reject,
        resolve,
        type,
      } as Request

      if (entrypoint === 'sidepanel') {
        sendMessage('invalidateRequest')
      }
    })
  }

  private async createPopupWindow(): Promise<number> {
    const window = await browser.windows.create({
      focused: true,
      height: 600,
      type: 'popup',
      url: browser.runtime.getURL(`/request.html`),
      width: 400,
    })

    const id = window?.id
    if (!id) {
      throw new Error('Failed to create request window')
    }

    return id
  }

  get() {
    return this.request
  }

  reject() {
    if (!this.request) {
      throw new Error('No request to reject')
    }

    this.request.reject(new Error('Request rejected'))

    this.reset()
  }

  resolve(
    data:
      | SolanaSignAndSendTransactionOutput[]
      | SolanaSignInOutput[]
      | SolanaSignMessageOutput[]
      | SolanaSignTransactionOutput[]
      | StandardConnectOutput,
  ) {
    if (!this.request) {
      throw new Error('No request to resolve')
    }

    if (this.request.type === 'connect') {
      this.request.resolve(data as StandardConnectOutput)
    } else if (this.request.type === 'signMessage') {
      this.request.resolve(data as SolanaSignMessageOutput[])
    } else if (this.request.type === 'signIn') {
      this.request.resolve(data as SolanaSignInOutput[])
    } else if (this.request.type === 'signTransaction') {
      this.request.resolve(data as SolanaSignTransactionOutput[])
    } else if (this.request.type === 'signAndSendTransaction') {
      this.request.resolve(data as SolanaSignAndSendTransactionOutput[])
    }

    this.reset()
  }

  async reset() {
    const id = this.request?.id
    this.request = null
    if (id) {
      browser.windows.remove(id)
    }

    const entrypoint = await getEntrypoint()
    if (entrypoint === 'sidepanel') {
      sendMessage('invalidateRequest')
    }
  }
}

export const [registerRequestService, getRequestService] = defineProxyService(
  'RequestService',
  () => new RequestService(),
)
