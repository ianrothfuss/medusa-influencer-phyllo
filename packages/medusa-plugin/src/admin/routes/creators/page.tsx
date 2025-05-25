// src/admin/routes/creators/page.tsx
import React, { useState, useEffect } from "react"
import { 
  Button, 
  Input, 
  Select, 
  Table, 
  Badge, 
  Avatar,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@medusajs/ui"

const CreatorsPage = () => {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    platform: "",
    verification_status: "",
    min_followers: "",
    search: ""
  })
  const [selectedCreator, setSelectedCreator] = useState(null)

  useEffect(() => {
    fetchCreators()
  }, [filters])

  const fetchCreators = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await fetch(`/admin/creators?${params}`)
      const data = await response.json()
      setCreators(data.creators)
    } catch (error) {
      console.error("Failed to fetch creators:", error)
    } finally {
      setLoading(false)
    }
  }

  const syncCreatorData = async (creatorId: string) => {
    try {
      await fetch(`/admin/creators/${creatorId}/sync`, { method: "POST" })
      fetchCreators() // Refresh data
    } catch (error) {
      console.error("Failed to sync creator data:", error)
    }
  }

  const updateVerificationStatus = async (creatorId: string, status: string) => {
    try {
      await fetch(`/admin/creators/${creatorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verification_status: status })
      })
      fetchCreators() // Refresh data
    } catch (error) {
      console.error("Failed to update verification status:", error)
    }
  }

  const columns = [
    {
      key: "creator",
      label: "Creator",
      render: (creator: any) => (
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
      )
    },
    {
      key: "platforms",
      label: "Platforms",
      render: (creator: any) => (
        <div className="flex flex-wrap gap-1">
          {creator.platforms.map((platform: any, idx: number) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {platform.platform_name}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: "followers",
      label: "Total Reach",
      render: (creator: any) => {
        const totalFollowers = creator.platforms.reduce(
          (sum: number, p: any) => sum + (p.metrics?.followers_count || 0), 
          0
        )
        return formatNumber(totalFollowers)
      }
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      render: (creator: any) => {
        const avgEngagement = creator.platforms.reduce(
          (sum: number, p: any) => sum + (p.metrics?.engagement_rate || 0), 
          0
        ) / (creator.platforms.length || 1)
        return `${avgEngagement.toFixed(2)}%`
      }
    },
    {
      key: "status",
      label: "Status",
      render: (creator: any) => (
        <Badge color={getVerificationBadgeColor(creator.verification_status)}>
          {creator.verification_status}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (creator: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => syncCreatorData(creator.id)}
          >
            Sync
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCreator(creator)}
              >
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Creator Details</DialogTitle>
              </DialogHeader>
              {selectedCreator && <CreatorDetails creator={selectedCreator} />}
            </DialogContent>
          </Dialog>
        </div>
      )
    }
  ]

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getVerificationBadgeColor = (status: string) => {
    switch (status) {
      case "verified": return "green"
      case "pending": return "yellow"
      case "suspended": return "red"
      default: return "grey"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Creators</h1>
        <Button>Add Creator</Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
        <Input
          placeholder="Search creators..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          value={filters.platform}
          onValueChange={(value) => setFilters({ ...filters, platform: value })}
        >
          <option value="">All Platforms</option>
          <option value="youtube">YouTube</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="twitch">Twitch</option>
        </Select>
        <Select
          value={filters.verification_status}
          onValueChange={(value) => setFilters({ ...filters, verification_status: value })}
        >
          <option value="">All Statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </Select>
        <Input
          type="number"
          placeholder="Min followers"
          value={filters.min_followers}
          onChange={(e) => setFilters({ ...filters, min_followers: e.target.value })}
        />
      </div>

      {/* Table */}
      <Table>
        <Table.Header>
          {columns.map((column) => (
            <Table.HeaderCell key={column.key}>
              {column.label}
            </Table.HeaderCell>
          ))}
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} className="text-center py-8">
                Loading...
              </Table.Cell>
            </Table.Row>
          ) : creators.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} className="text-center py-8">
                No creators found
              </Table.Cell>
            </Table.Row>
          ) : (
            creators.map((creator: any) => (
              <Table.Row key={creator.id}>
                {columns.map((column) => (
                  <Table.Cell key={column.key}>
                    {column.render(creator)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

const CreatorDetails = ({ creator }: { creator: any }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar 
          src={creator.profile_picture_url} 
          fallback={creator.name.charAt(0)}
          className="h-16 w-16"
        />
        <div>
          <h3 className="text-lg font-semibold">{creator.name}</h3>
          <p className="text-gray-600">{creator.email}</p>
        </div>
      </div>

      {creator.bio && (
        <div>
          <h4 className="font-medium mb-2">Bio</h4>
          <p className="text-gray-700">{creator.bio}</p>
        </div>
      )}

      <div>
        <h4 className="font-medium mb-3">Connected Platforms</h4>
        <div className="space-y-3">
          {creator.platforms.map((platform: any, idx: number) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium capitalize">{platform.platform_name}</div>
                  <div className="text-sm text-gray-600">@{platform.platform_username}</div>
                </div>
                <div className="text-right text-sm">
                  <div>{formatNumber(platform.metrics?.followers_count || 0)} followers</div>
                  <div className="text-gray-600">{platform.metrics?.engagement_rate?.toFixed(2)}% engagement</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreatorsPage