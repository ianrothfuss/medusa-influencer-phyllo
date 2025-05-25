// hooks/useCreatorAuth.ts
import { useState, useEffect } from 'react'

interface CreatorAuthData {
  creatorId: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useCreatorAuth = (): CreatorAuthData => {
  const [authData, setAuthData] = useState<CreatorAuthData>({
    creatorId: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setAuthData({
            creatorId: userData.creatorId,
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          setAuthData({
            creatorId: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthData({
          creatorId: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }

    checkAuth()
  }, [])

  return authData
}