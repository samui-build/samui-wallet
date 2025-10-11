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

import { sendMessage } from 'webext-bridge/window'

import { ACTIONS } from './actions'

export const sendConnectMessage = async (data: StandardConnectInput | undefined): Promise<StandardConnectOutput> =>
  sendMessage(ACTIONS.CONNECT, data ?? {}, 'background')

export const sendDisconnectMessage = async (): Promise<void> => sendMessage(ACTIONS.DISCONNECT, undefined, 'background')

export const sendSignAndSendTransactionMessage = async (
  data: SolanaSignAndSendTransactionInput[],
): Promise<SolanaSignAndSendTransactionOutput[]> => sendMessage(ACTIONS.SIGN_AND_SEND_TRANSACTION, data, 'background')

export const sendSignInMessage = async (data: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> =>
  sendMessage(ACTIONS.SIGN_IN, data, 'background')

export const sendSignMessage = async (data: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> =>
  sendMessage(ACTIONS.SIGN_MESSAGE, data, 'background')

export const sendSignTransactionMessage = async (
  data: SolanaSignTransactionInput[],
): Promise<SolanaSignTransactionOutput[]> => sendMessage(ACTIONS.SIGN_TRANSACTION, data, 'background')
