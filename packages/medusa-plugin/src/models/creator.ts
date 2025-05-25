// src/models/creator.ts
import { BaseEntity, BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm"
import { CreatorCampaign } from "./creator-campaign"
import { CreatorPlatform } from "./creator-platform"

@Entity()
export class Creator extends BaseEntity {
  @Column({ type: "varchar" })
  id: string

  @Index()
  @Column({ type: "varchar", unique: true })
  phyllo_user_id: string

  @Column({ type: "varchar" })
  email: string

  @Column({ type: "varchar" })
  name: string

  @Column({ type: "varchar", nullable: true })
  profile_picture_url?: string

  @Column({ type: "text", nullable: true })
  bio?: string

  @Column({ type: "varchar", nullable: true })
  location?: string

  @Column({ type: "enum", enum: ["pending", "verified", "suspended", "rejected"] })
  verification_status: string

  @Column({ type: "json", nullable: true })
  contact_info?: {
    phone?: string
    website?: string
    business_email?: string
  }

  @Column({ type: "json", nullable: true })
  preferences?: {
    collaboration_types: string[]
    content_categories: string[]
    min_budget?: number
  }

  @OneToMany(() => CreatorPlatform, (platform) => platform.creator)
  platforms: CreatorPlatform[]

  @OneToMany(() => CreatorCampaign, (campaign) => campaign.creator)
  campaigns: CreatorCampaign[]

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = `creator_${Date.now()}`
  }
}

// src/models/creator-platform.ts
import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { Creator } from "./creator"

@Entity()
export class CreatorPlatform extends BaseEntity {
  @Column({ type: "varchar" })
  id: string

  @Column({ type: "varchar" })
  creator_id: string

  @ManyToOne(() => Creator, (creator) => creator.platforms)
  @JoinColumn({ name: "creator_id" })
  creator: Creator

  @Column({ type: "varchar" })
  platform_name: string

  @Column({ type: "varchar" })
  phyllo_account_id: string

  @Column({ type: "varchar" })
  platform_username: string

  @Column({ type: "varchar", nullable: true })
  platform_url?: string

  @Column({ type: "json", nullable: true })
  metrics?: {
    followers_count?: number
    following_count?: number
    posts_count?: number
    engagement_rate?: number
    avg_likes?: number
    avg_comments?: number
    avg_shares?: number
    total_views?: number
  }

  @Column({ type: "json", nullable: true })
  audience_demographics?: {
    age_groups?: Record<string, number>
    gender_split?: Record<string, number>
    top_locations?: Array<{ country: string; percentage: number }>
  }

  @Column({ type: "timestamp", nullable: true })
  last_synced_at?: Date

  @Column({ type: "boolean", default: true })
  is_active: boolean

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = `cp_${Date.now()}`
  }
}
