// src/admin/widgets/creator-dashboard/page.tsx
import React, { useState, useEffect } from "react"
import { Card, Button, Badge, Avatar, Progress } from "@medusajs/ui"
import { defineWidgetConfig } from "@medusajs/admin-sdk"

interface Creator {
  id: string
  name: string
  email: string
  profile_picture_url?: string
  verification_status: string
  platforms: Platform[]
}

interface Platform {
  platform_name: string
  platform_username: string
  metrics: {
    followers_count: number
    engagement_rate: number
  }
}

const CreatorDashboardWidget = () => {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    totalFollowers: 0
  })

  useEffect(() => {
    fetchCreators()
  }, [])

  const fetchCreators = async () => {
    try {
      const response = await fetch("/admin/creators?limit=10")
      const data = await response.json()
      setCreators(data.creators)
      
      // Calculate stats
      const totalFollowers = data.creators.reduce((sum: number, creator: Creator) => {
        return sum + creator.platforms.reduce((platformSum, platform) => {
          return platformSum + platform.metrics.followers_count
        }, 0)
      }, 0)

      setStats({
        total: data.count,
        verified: data.creators.filter((c: Creator) => c.verification_status === "verified").length,
        pending: data.creators.filter((c: Creator) => c.verification_status === "pending").length,
        totalFollowers
      })
    } catch (error) {
      console.error("Failed to fetch creators:", error)
    } finally {
      setLoading(false)
    }
  }

  const getVerificationBadgeColor = (status: string) => {
    switch (status) {
      case "verified": return "green"
      case "pending": return "yellow"
      case "suspended": return "red"
      default: return "grey"
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Creators</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          <div className="text-sm text-gray-600">Verified</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{formatNumber(stats.totalFollowers)}</div>
          <div className="text-sm text-gray-600">Total Reach</div>
        </Card>
      </div>

      {/* Recent Creators */}
      <Card>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Creators</h3>
            <Button variant="secondary" size="sm">
              View All
            </Button>
          </div>
        </div>
        <div className="p-0">
          {creators.map((creator) => (
            <div key={creator.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={creator.profile_picture_url} 
                    fallback={creator.name.charAt(0)} 
                  />
                  <div>
                    <div className="font-medium">{creator.name}</div>
                    <div className="text-sm text-gray-600">{creator.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatNumber(
                        creator.platforms.reduce((sum, p) => sum + p.metrics.followers_count, 0)
                      )} followers
                    </div>
                    <div className="text-gray-600">
                      {creator.platforms.length} platform{creator.platforms.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <Badge color={getVerificationBadgeColor(creator.verification_status)}>
                    {creator.verification_status}
                  </Badge>
                </div>
              </div>
              
              {/* Platform indicators */}
              <div className="flex space-x-2 mt-3">
                {creator.platforms.map((platform, idx) => (
                  <div key={idx} className="flex items-center space-x-1 text-xs bg-gray-100 rounded px-2 py-1">
                    <span className="capitalize">{platform.platform_name}</span>
                    <span className="text-gray-600">@{platform.platform_username}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default defineWidgetConfig({
  zone: "dashboard",
})

export { CreatorDashboardWidget }
