// DuckChain blockchain integration types for QuackNet Framework

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
export type TransactionStatus = 'idle' | 'pending' | 'confirmed' | 'failed'
export type AppealStatus = 'none' | 'pending' | 'submitted' | 'voting' | 'resolved' | 'rejected'

export interface WalletInfo {
  address: string
  balance: number // $DUCK balance
  isConnected: boolean
}

export interface DuckChainConnection {
  status: ConnectionStatus
  network: string
  blockHeight?: number
  wallet?: WalletInfo
}

export interface Transaction {
  id: string
  type: 'appeal' | 'vote' | 'stake'
  status: TransactionStatus
  hash?: string
  timestamp: number
  amount: number
  messageId?: string
}

export interface AppealTransaction {
  messageId: string
  appealer: string
  stakeAmount: number
  reason: string
  transactionHash: string
  timestamp: number
  status: AppealStatus
  votingDeadline?: number
}

export interface BlockchainConfig {
  rpcUrl: string
  chainId: number
  contractAddress: string
  stakingAmount: number
  votingPeriod: number
}

export class DuckChainError extends Error {
  code: string
  details?: any

  constructor(params: { code: string; message: string; details?: any }) {
    super(params.message)
    this.code = params.code
    this.details = params.details
    this.name = 'DuckChainError'
  }
}