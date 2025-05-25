// src/services/creator.ts
import { TransactionBaseService } from "@medusajs/framework"
import { Creator } from "../models/creator"
import { CreatorPlatform } from "../models/creator-platform"
import { PhylloClientService } from "./phyllo-client"

export class CreatorService extends TransactionBaseService {
  constructor(
    private phylloClient: PhylloClientService
  ) {
    super()
  }

  async createCreator(data: {
    email: string
    name: string
    bio?: string
    contact_info?: any
    preferences?: any
  }) {
    // Create user in Phyllo
    const phylloUser = await this.phylloClient.createUser({
      name: data.name,
      email: data.email,
      external_id: `creator_${Date.now()}`
    })

    // Create creator in our database
    const creator = new Creator()
    Object.assign(creator, {
      ...data,
      phyllo_user_id: phylloUser.id,
      verification_status: "pending"
    })

    await creator.save()
    return creator
  }

  async getCreator(id: string) {
    const creator = await Creator.findOne({
      where: { id },
      relations: ["platforms", "campaigns"]
    })

    if (!creator) {
      throw new Error("Creator not found")
    }

    return creator
  }

  async syncCreatorPlatforms(creatorId: string) {
    const creator = await this.getCreator(creatorId)
    
    // Get connected accounts from Phyllo
    const accounts = await this.phylloClient.getConnectedAccounts(creator.phyllo_user_id)

    for (const account of accounts.data) {
      // Get identity and engagement data
      const [identity, engagement, audience] = await Promise.all([
        this.phylloClient.getIdentityData(account.id),
        this.phylloClient.getEngagementData(account.id),
        this.phylloClient.getAudienceData(account.id)
      ])

      // Update or create platform record
      let platform = await CreatorPlatform.findOne({
        where: { 
          creator_id: creatorId,
          phyllo_account_id: account.id
        }
      })

      if (!platform) {
        platform = new CreatorPlatform()
        platform.creator_id = creatorId
        platform.phyllo_account_id = account.id
      }

      Object.assign(platform, {
        platform_name: account.platform,
        platform_username: identity.data.username,
        platform_url: identity.data.url,
        metrics: {
          followers_count: identity.data.follower_count,
          following_count: identity.data.following_count,
          posts_count: engagement.data.length,
          engagement_rate: this.calculateEngagementRate(engagement.data),
          avg_likes: this.calculateAverageMetric(engagement.data, "like_count"),
          avg_comments: this.calculateAverageMetric(engagement.data, "comment_count"),
          avg_shares: this.calculateAverageMetric(engagement.data, "share_count"),
          total_views: this.calculateTotalMetric(engagement.data, "view_count")
        },
        audience_demographics: audience.data,
        last_synced_at: new Date(),
        is_active: true
      })

      await platform.save()
    }

    return this.getCreator(creatorId)
  }

  private calculateEngagementRate(posts: any[]): number {
    if (!posts.length) return 0
    
    const totalEngagement = posts.reduce((sum, post) => {
      return sum + (post.like_count || 0) + (post.comment_count || 0) + (post.share_count || 0)
    }, 0)
    
    const avgFollowers = posts.reduce((sum, post) => sum + (post.follower_count || 0), 0) / posts.length
    
    return avgFollowers > 0 ? (totalEngagement / posts.length / avgFollowers) * 100 : 0
  }

  private calculateAverageMetric(posts: any[], metric: string): number {
    if (!posts.length) return 0
    const total = posts.reduce((sum, post) => sum + (post[metric] || 0), 0)
    return Math.round(total / posts.length)
  }

  private calculateTotalMetric(posts: any[], metric: string): number {
    return posts.reduce((sum, post) => sum + (post[metric] || 0), 0)
  }

  async updateCreatorVerificationStatus(creatorId: string, status: string) {
    const creator = await Creator.findOne({ where: { id: creatorId } })
    if (!creator) {
      throw new Error("Creator not found")
    }

    creator.verification_status = status
    creator.updated_at = new Date()
    await creator.save()

    return creator
  }

  async searchCreators(filters: {
    platform?: string
    min_followers?: number
    max_followers?: number
    engagement_rate?: number
    location?: string
    categories?: string[]
    verification_status?: string
  }) {
    const queryBuilder = Creator.createQueryBuilder("creator")
      .leftJoinAndSelect("creator.platforms", "platform")
      .leftJoinAndSelect("creator.campaigns", "campaign")

    if (filters.platform) {
      queryBuilder.andWhere("platform.platform_name = :platform", { 
        platform: filters.platform 
      })
    }

    if (filters.min_followers) {
      queryBuilder.andWhere("platform.metrics->>'followers_count' >= :minFollowers", {
        minFollowers: filters.min_followers
      })
    }

    if (filters.max_followers) {
      queryBuilder.andWhere("platform.metrics->>'followers_count' <= :maxFollowers", {
        maxFollowers: filters.max_followers
      })
    }

    if (filters.engagement_rate) {
      queryBuilder.andWhere("platform.metrics->>'engagement_rate' >= :engagementRate", {
        engagementRate: filters.engagement_rate
      })
    }

    if (filters.location) {
      queryBuilder.andWhere("creator.location ILIKE :location", {
        location: `%${filters.location}%`
      })
    }

    if (filters.verification_status) {
      queryBuilder.andWhere("creator.verification_status = :status", {
        status: filters.verification_status
      })
    }

    return await queryBuilder.getMany()
  }
}