// pages/creator/dashboard.tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CreatorDashboard } from '../../components/creator-portal/CreatorDashboard'

const CreatorDashboardPage = () => {
  const router = useRouter()
  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get creator ID from session/auth or URL params
    const fetchCreatorId = async () => {
      try {
        // This would typically come from your authentication system
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setCreatorId(userData.creatorId)
        } else {
          // Redirect to login if not authenticated
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Failed to get creator ID:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchCreatorId()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!creatorId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Not authenticated</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CreatorDashboard creatorId={creatorId} />
      </div>
    </div>
  )
}

export default CreatorDashboardPage
