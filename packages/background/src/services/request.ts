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

// @ts-ignore -- https://github.com/aklinker1/webext-core/pull/117
import { defineProxyService } from '@webext-core/proxy-service'
import { browser } from '@wxt-dev/browser'

type DataType<T extends Requests['type']> = Extract<Requests, { type: T }>['data']

type Requests =
  | {
      data: SolanaSignAndSendTransactionInput[]
      id: number
      reject: (reason?: Error) => void
      resolve: (data: SolanaSignAndSendTransactionOutput[]) => void
      type: 'signAndSendTransaction'
    }
  | {
      data: SolanaSignInInput[]
      id: number
      reject: (reason?: Error) => void
      resolve: (data: SolanaSignInOutput[]) => void
      type: 'signIn'
    }
  | {
      data: SolanaSignMessageInput[]
      id: number
      reject: (reason?: Error) => void
      resolve: (data: SolanaSignMessageOutput[]) => void
      type: 'signMessage'
    }
  | {
      data: SolanaSignTransactionInput[]
      id: number
      reject: (reason?: Error) => void
      resolve: (data: SolanaSignTransactionOutput[]) => void
      type: 'signTransaction'
    }
  | {
      data: StandardConnectInput | undefined
      id: number
      reject: (reason?: Error) => void
      resolve: (data: StandardConnectOutput) => void
      type: 'connect'
    }

type ResolveType<T extends Requests['type']> = Extract<Requests, { type: T }> extends {
  resolve: (data: infer R) => void
}
  ? R
  : never

class RequestService {
  private request?: Requests | undefined

  constructor() {
    browser.windows.onRemoved.addListener((windowId: number) => {
      if (this.request && this.request.id === windowId) {
        this.request.reject(new Error('Request closed'))
        this.request = undefined
      }
    })
  }

  async create<T extends Requests['type']>(type: T, data: DataType<T>): Promise<ResolveType<T>> {
    if (this.request) {
      throw new Error('Request already exists')
    }

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

    return new Promise((resolve, reject) => {
      this.request = {
        data,
        id,
        reject,
        resolve,
        type,
      } as Requests
    })
  }

  get() {
    return this.request
  }

  reject() {
    if (!this.request) {
      throw new Error('No request to reject')
    }

    const id = this.request.id
    this.request.reject(new Error('Request rejected'))
    this.request = undefined
    browser.windows.remove(id)
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

    const id = this.request.id
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

    this.request = undefined
    browser.windows.remove(id)
  }
}

export const [registerRequestService, getRequestService] = defineProxyService(
  'RequestService',
  () => new RequestService(),
)
