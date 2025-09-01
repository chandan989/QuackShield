// React hook for DuckChain blockchain integration

import { useState, useEffect, useCallback } from 'react'
import { duckChainService, formatDuckBalance, formatAddress } from '../utils/duckchain'
import type { 
  DuckChainConnection, 
  AppealTransaction, 
  Transaction, 
  DuckChainError 
} from '../types/blockchain'

export interface UseDuckChainReturn {
  // Connection state
  connection: DuckChainConnection
  isConnected: boolean
  isConnecting: boolean
  
  // Wallet info
  walletAddress: string | null
  walletBalance: number
  formattedBalance: string
  formattedAddress: string | null
  
  // Actions
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  submitAppeal: (messageId: string, reason?: string) => Promise<AppealTransaction>
  
  // Queries
  getAppeal: (messageId: string) => Promise<AppealTransaction | null>
  getTransaction: (hash: string) => Promise<Transaction | null>
  
  // Error handling
  error: DuckChainError | null
  clearError: () => void
}

export function useDuckChain(): UseDuckChainReturn {
  const [connection, setConnection] = useState<DuckChainConnection>(() => 
    duckChainService.getConnection()
  )
  const [error, setError] = useState<DuckChainError | null>(null)

  // Subscribe to connection changes
  useEffect(() => {
    const unsubscribe = duckChainService.onConnectionChange(setConnection)
    return unsubscribe
  }, [])

  // Clear error when connection status changes
  useEffect(() => {
    if (connection.status === 'connected') {
      setError(null)
    }
  }, [connection.status])

  // Connection actions
  const connect = useCallback(async () => {
    try {
      setError(null)
      await duckChainService.connect()
    } catch (err) {
      setError(err as DuckChainError)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      setError(null)
      await duckChainService.disconnect()
    } catch (err) {
      setError(err as DuckChainError)
    }
  }, [])

  // Appeal submission
  const submitAppeal = useCallback(async (messageId: string, reason = 'Content appeal') => {
    try {
      setError(null)
      return await duckChainService.submitAppeal(messageId, reason)
    } catch (err) {
      setError(err as DuckChainError)
      throw err
    }
  }, [])

  // Data queries
  const getAppeal = useCallback(async (messageId: string) => {
    try {
      return await duckChainService.getAppeal(messageId)
    } catch (err) {
      setError(err as DuckChainError)
      return null
    }
  }, [])

  const getTransaction = useCallback(async (hash: string) => {
    try {
      return await duckChainService.getTransaction(hash)
    } catch (err) {
      setError(err as DuckChainError)
      return null
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Computed values
  const isConnected = duckChainService.isConnected()
  const isConnecting = connection.status === 'connecting'
  const walletAddress = connection.wallet?.address || null
  const walletBalance = connection.wallet?.balance || 0
  const formattedBalance = formatDuckBalance(walletBalance)
  const formattedAddress = walletAddress ? formatAddress(walletAddress) : null

  return {
    // Connection state
    connection,
    isConnected,
    isConnecting,
    
    // Wallet info
    walletAddress,
    walletBalance,
    formattedBalance,
    formattedAddress,
    
    // Actions
    connect,
    disconnect,
    submitAppeal,
    
    // Queries
    getAppeal,
    getTransaction,
    
    // Error handling
    error,
    clearError
  }
}