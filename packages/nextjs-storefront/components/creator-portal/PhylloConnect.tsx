// components/creator-portal/PhylloConnect.tsx
import React, { useEffect, useState } from 'react'
import { PhylloSDK } from '../../lib/phyllo-sdk'

interface PhylloConnectProps {
  userId: string
  onAccountConnected?: (data: any) => void
  onAccountDisconnected?: (data: any) => void
  className?: string
}

export const PhylloConnect: React.FC<PhylloConnectProps> = ({
  userId,
  onAccountConnected,
  onAccountDisconnected,
  className = ""
}) => {
  const [phylloSDK, setPhylloSDK] = useState<PhylloSDK | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializePhyllo()
  }, [userId])

  const initializePhyllo = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get SDK token from your backend
      const response = await fetch('/api/creator-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      if (!response.ok) {
        throw new Error('Failed to get SDK token')
      }

      const { sdk_token } = await response.json()

      const sdk = new PhylloSDK({
        clientDisplayName: "Your Store Creator Portal",
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
        userId: userId,
        token: sdk_token.token,
        redirectURL: window.location.origin + '/creator/dashboard'
      })

      // Set event handlers
      sdk.onAccountConnected = (data) => {
        console.log('Account connected successfully:', data)
        onAccountConnected?.(data)
      }

      sdk.onAccountDisconnected = (data) => {
        console.log('Account disconnected:', data)
        onAccountDisconnected?.(data)
      }

      sdk.onTokenExpired = () => {
        console.log('Token expired, reinitializing...')
        initializePhyllo() // Reinitialize with new token
      }

      await sdk.initialize()
      setPhylloSDK(sdk)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Phyllo')
      console.error('Phyllo initialization error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    if (phylloSDK) {
      phylloSDK.open()
    }
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={initializePhyllo}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        onClick={handleConnect}
        disabled={isLoading || !phylloSDK}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Loading...</span>
          </>
        ) : (
          <span>Connect Your Social Accounts</span>
        )}
      </button>
    </div>
  )
}