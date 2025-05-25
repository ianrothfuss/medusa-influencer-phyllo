// components/creator-portal/CreatorDashboard.tsx
import React, { useState, useEffect } from 'react'
import { PhylloConnect } from './PhylloConnect'

interface Platform {
  id: string
  platform_name: string
  platform_username: string
  platform_url?: string
  metrics: {
    followers_count: number
    following_count: number
    posts_count: number
    engagement_rate: number
    avg_likes: number
    avg_comments: number
    avg_shares: number
  }
  audience_demographics?: any
  last_synced_at: string
  is_active: boolean
}

interface Creator {
  id: string
  name: string
  email: string
  profile_picture_url?: string
  verification_status: string
  platforms: Platform[]
}

interface CreatorDashboardProps {
  creatorId: string
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ creatorId }) => {
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchCreatorData()
  }, [creatorId])

  const fetchCreatorData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/creators/${creatorId}`)
      if (response.ok) {
        const data = await response.json()
        setCreator(data.creator)
      }
    } catch (error) {
      console.error('Failed to fetch creator data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccountConnected = async () => {
    // Refresh creator data after successful connection
    await fetchCreatorData()
  }

  const syncPlatformData = async () => {
    try {
      setSyncing(true)
      const response = await fetch(`/api/creators/${creatorId}/sync`, {
        method: 'POST'
      })
      if (response.ok) {
        await fetchCreatorData()
      }
    } catch (error) {
      console.error('Failed to sync platform data:', error)
    } finally {
      setSyncing(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'suspended': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Creator not found</p>
      </div>
    )
  }

  const totalFollowers = creator.platforms.reduce(
    (sum, platform) => sum + platform.metrics.followers_count, 
    0
  )

  const avgEngagement = creator.platforms.length > 0 
    ? creator.platforms.reduce((sum, p) => sum + p.metrics.engagement_rate, 0) / creator.platforms.length
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {creator.profile_picture_url ? (
              <img 
                src={creator.profile_picture_url} 
                alt={creator.name}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                {creator.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{creator.name}</h1>
              <p className="text-gray-600">{creator.email}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getVerificationStatusColor(creator.verification_status)}`}>
                {creator.verification_status}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={syncPlatformData}
              disabled={syncing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-blue-600">{creator.platforms.length}</div>
          <div className="text-sm text-gray-600">Connected Platforms</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-green-600">{formatNumber(totalFollowers)}</div>
          <div className="text-sm text-gray-600">Total Followers</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-purple-600">{avgEngagement.toFixed(2)}%</div>
          <div className="text-sm text-gray-600">Avg Engagement Rate</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-orange-600">
            {creator.platforms.reduce((sum, p) => sum + p.metrics.posts_count, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
      </div>

      {/* Connected Platforms */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Connected Platforms</h2>
            <PhylloConnect 
              userId={creator.id} 
              onAccountConnected={handleAccountConnected}
            />
          </div>
        </div>
        <div className="p-0">
          {creator.platforms.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">No platforms connected yet</p>
              <PhylloConnect 
                userId={creator.id} 
                onAccountConnected={handleAccountConnected}
                className="inline-block"
              />
            </div>
          ) : (
            <div className="divide-y">
              {creator.platforms.map((platform) => (
                <div key={platform.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {platform.platform_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium capitalize">{platform.platform_name}</h3>
                        <p className="text-sm text-gray-600">@{platform.platform_username}</p>
                        {platform.platform_url && (
                          <a 
                            href={platform.platform_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Profile
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Last synced: {new Date(platform.last_synced_at).toLocaleDateString()}
                      </div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                        platform.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {platform.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Platform Metrics */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-semibold">{formatNumber(platform.metrics.followers_count)}</div>
                      <div className="text-xs text-gray-600">Followers</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-semibold">{platform.metrics.engagement_rate.toFixed(2)}%</div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-semibold">{formatNumber(platform.metrics.avg_likes)}</div>
                      <div className="text-xs text-gray-600">Avg Likes</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-semibold">{platform.metrics.posts_count}</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
